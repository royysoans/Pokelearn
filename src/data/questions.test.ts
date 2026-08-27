import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateQuestions, fetchQuizQuestions } from './questions';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  invokeFunction: vi.fn(),
  supabase: {
    from: vi.fn(),
  },
}));

import { invokeFunction } from '@/integrations/supabase/client';

describe('questions data service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
  });


  it('generates questions using AI invokeFunction and saves to offline cache', async () => {
    const mockQuestions = [
      { q: 'What is 5 + 5?', a: ['8', '10', '12'], c: '10', e: '5 plus 5 equals 10.' },
      { q: 'What is 3 * 3?', a: ['6', '9', '12'], c: '9', e: '3 times 3 equals 9.' },
    ];
    vi.mocked(invokeFunction).mockResolvedValueOnce({ questions: mockQuestions });

    const result = await generateQuestions('math', 2, 'Kanto', 'Math Gym', 1);

    expect(invokeFunction).toHaveBeenCalledWith('generate-quiz', expect.objectContaining({
      subject: 'math',
      count: 2,
      region: 'Kanto',
    }));
    expect(result).toHaveLength(2);
    expect(result.map(q => q.q)).toContain('What is 5 + 5?');

    // Check offline cache persistence
    const cached = localStorage.getItem('offlineQuiz:Kanto:Math Gym:math:1');
    expect(cached).not.toBeNull();
    expect(JSON.parse(cached!)).toHaveLength(2);
  });

  it('restores questions from offline cache when AI API fails', async () => {
    const cachedQuestions = [
      { q: 'Cached: What is 10 - 4?', a: ['5', '6', '7'], c: '6', e: '10 minus 4 is 6.' },
      { q: 'Cached: What is 4 * 4?', a: ['12', '16', '20'], c: '16', e: '4 times 4 is 16.' },
    ];
    localStorage.setItem('offlineQuiz:Johto:Science Gym:math:2', JSON.stringify(cachedQuestions));

    // Simulate API network failure
    vi.mocked(invokeFunction).mockRejectedValueOnce(new Error('Network error'));

    const result = await generateQuestions('math', 2, 'Johto', 'Science Gym', 2);

    expect(result).toHaveLength(2);
    expect(result[0].q).toContain('Cached:');
  });

  it('uses questionBank fallback when offline cache is empty and API fails', async () => {
    vi.mocked(invokeFunction).mockRejectedValueOnce(new Error('API Down'));

    const result = await fetchQuizQuestions('coding', 3);

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty('q');
    expect(result[0]).toHaveProperty('a');
    expect(result[0]).toHaveProperty('c');
  });
});
