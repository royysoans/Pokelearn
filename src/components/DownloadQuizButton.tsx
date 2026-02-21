import { useState } from "react";
import { Question } from "@/types/game";
import { PixelButton } from "./PixelButton";
import { Download, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadQuizButtonProps {
    questions: Question[];
    topic: string;
}

export function DownloadQuizButton({ questions, topic }: DownloadQuizButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();

    const handleDownload = () => {
        setIsDownloading(true);

        try {
            // 1. Format the questions into a readable text document
            let textContent = `PokéLearn - Quiz Notes: ${topic}\n`;
            textContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
            textContent += `====================================================\n\n`;

            questions.forEach((q, index) => {
                textContent += `Question ${index + 1}: ${q.q}\n`;

                q.a.forEach((option, i) => {
                    const letter = String.fromCharCode(65 + i); // A, B, C, D
                    const isCorrect = option === q.c;
                    textContent += `  ${letter}) ${option} ${isCorrect ? " (✓ Correct)" : ""}\n`;
                });

                if (q.e) {
                    textContent += `\n  Professor Oak's Note:\n  "${q.e}"\n`;
                }

                textContent += `\n----------------------------------------------------\n\n`;
            });

            // 2. Create the Blob and download link
            const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            const safeTopicName = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.href = url;
            link.download = `pokelearn_${safeTopicName}_notes.txt`;

            document.body.appendChild(link);
            link.click();

            // 3. Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({
                title: "Download Complete! 📝",
                description: "Your study notes have been saved.",
            });

        } catch (error) {
            console.error("Failed to generate download:", error);
            toast({
                title: "Download Failed",
                description: "There was an error generating your notes.",
                variant: "destructive"
            });
        } finally {
            setTimeout(() => setIsDownloading(false), 1500); // Keep checkmark visible briefly
        }
    };

    if (questions.length === 0) return null;

    return (
        <PixelButton
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
            {isDownloading ? (
                <>
                    <CheckCircle2 className="w-5 h-5 text-green-400" /> Downloading...
                </>
            ) : (
                <>
                    <Download className="w-5 h-5" /> Download Study Notes
                </>
            )}
        </PixelButton>
    );
}
