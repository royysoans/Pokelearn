import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrainerCard } from "@/components/TrainerCard";
import { Edit, Save, User, Download, Share2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toPng } from 'html-to-image';
import download from 'downloadjs';

export const ProfileCustomization = () => {
    const { gameState, updateProfile } = useGame();
    const [isOpen, setIsOpen] = useState(false);

    // Local state for form
    const [name, setName] = useState(gameState.name);
    const [bio, setBio] = useState(gameState.bio || "");
    const [bg, setBg] = useState(gameState.cardBackground || "default");
    const [avatar, setAvatar] = useState(gameState.avatarId || "trainer-1");

    // New Features State
    const [selectedPokemonId, setSelectedPokemonId] = useState<string>("none");

    const handleOpen = () => {
        setName(gameState.name);
        setBio(gameState.bio || "");
        setBg(gameState.cardBackground || "default");
        setAvatar(gameState.avatarId || "trainer-1");
        setIsOpen(true);
    };

    const handleSave = async () => {
        await updateProfile({
            name,
            bio,
            cardBackground: bg,
            avatarId: avatar
        });
        setIsOpen(false);
    };

    // Derived state for preview
    const selectedPokemon = gameState.pokemon.find(p => p.id.toString() === selectedPokemonId);
    // Determine image source. The GameState Pokemon type has 'image' field (verified in types).
    const pokemonImage = selectedPokemon ? selectedPokemon.image : undefined;

    const generateCardImage = async () => {
        const cardElement = document.getElementById('trainer-card-preview');
        if (!cardElement) return null;
        try {
            const dataUrl = await toPng(cardElement, {
                cacheBust: true,
                pixelRatio: 4, // High quality
                quality: 1.0,
                style: { transform: 'scale(1)' }
            });
            return dataUrl;
        } catch (error) {
            console.error('Could not generate image', error);
            return null;
        }
    };

    const handleDownload = async () => {
        const dataUrl = await generateCardImage();
        if (dataUrl) {
            download(dataUrl, `trainer-card-${name.toLowerCase().replace(/\s+/g, '-')}.png`);
        }
    };

    const handleShare = async () => {
        const dataUrl = await generateCardImage();
        if (!dataUrl) return;

        // Convert Base64 to Blob/File for sharing
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "trainer-card.png", { type: "image/png" });

        // Native Share (Mobile/Supported Desktop)
        if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'My Pokelearn Trainer Card',
                    text: 'Check out my Trainer Card on Pokelearn!',
                });
            } catch (err) {
                console.log('Share cancelled or failed', err);
            }
        } else {
            // Fallback for desktop where file sharing isn't supported via Web API
            download(dataUrl, `trainer-card.png`);
            alert("Image downloaded! You can now upload it to your favorite social media.");
        }
    };

    const backgrounds = [
        { id: "default", name: "Classic Slate" },
        { id: "fire", name: "Blaze Red" },
        { id: "water", name: "Ocean Blue" },
        { id: "grass", name: "Forest Green" },
        { id: "electric", name: "Electric Yellow" },
        { id: "psychic", name: "Psychic Pink" },
        { id: "dark", name: "Shadow Black" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" onClick={handleOpen}>
                    <User className="w-4 h-4" />
                    Trainer Card
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[1200px] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Customize Trainer Card</DialogTitle>
                </DialogHeader>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 py-4 overflow-hidden">
                    {/* Preview Section */}
                    <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-xl overflow-hidden relative">
                        {/* Background Grid Pattern for professional feel */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider relative z-10">Live Preview</h3>

                        <div className="w-full h-full flex items-center justify-center relative z-10" style={{ minHeight: '400px' }}>
                            <div className="scale-90 lg:scale-100 transition-transform">
                                <TrainerCard
                                    id="trainer-card-preview"
                                    name={name}
                                    bio={bio}
                                    cardBackground={bg}
                                    avatarId={avatar}
                                    pokemonImage={pokemonImage}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col items-center gap-4 relative z-10 w-full max-w-sm">
                            <div className="w-full grid grid-cols-2 gap-4">
                                <Button variant="secondary" onClick={handleDownload} className="gap-2 font-semibold shadow-sm">
                                    <Download className="w-4 h-4" />
                                    Download
                                </Button>
                                <Button className="gap-2 font-semibold shadow-sm" onClick={handleShare}>
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center">
                                'Share' opens your device's native sharing menu (Mobile) or downloads the image (Desktop).
                            </p>
                        </div>
                    </div>

                    {/* Edit Controls */}
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-8 p-1">
                            <div className="space-y-3">
                                <Label className="text-base">Trainer Name</Label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="text-lg" />
                                <p className="text-xs text-muted-foreground">Max 20 characters</p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-base">Bio / Motto</Label>
                                <Textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell the world your story..."
                                    className="resize-none min-h-[100px] text-base"
                                    maxLength={140}
                                />
                                <p className="text-xs text-right text-muted-foreground">{bio.length}/140</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Card Theme</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {backgrounds.map((b) => (
                                        <div
                                            key={b.id}
                                            onClick={() => setBg(b.id)}
                                            className={`p-3 rounded-md border-2 cursor-pointer transition-all ${bg === b.id ? 'border-primary bg-primary/10' : 'border-transparent bg-muted'}`}
                                        >
                                            <div className="font-semibold text-sm">{b.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Partner Pokemon (Overrides Avatar)</Label>
                                <Select value={selectedPokemonId} onValueChange={setSelectedPokemonId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a partner..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None (Use Avatar)</SelectItem>
                                        {gameState.pokemon.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Avatar Style (Fallback)</Label>
                                <Select value={avatar} onValueChange={setAvatar}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Avatar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="trainer-1">Trainer Red</SelectItem>
                                        <SelectItem value="trainer-2">Trainer Blue</SelectItem>
                                        <SelectItem value="trainer-3">Ace Trainer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
