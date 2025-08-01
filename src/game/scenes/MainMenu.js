import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.cameras.main.fadeIn(1000, 255, 255, 255);
        var soundEffectConfig = {
            volume: 0.1
        }
        var bgMusicConfig = {
            volume: 0.1,
            rate: 1,
            mute: false,
            delay: 0,
            loop: true
        }
        this.startSound = this.sound.add('start-sound', soundEffectConfig);
        
        // Check if background music is already playing globally
        if (!this.game.bgMusic || !this.game.bgMusic.isPlaying) {
            this.game.bgMusic = this.sound.add('bg-music', bgMusicConfig);
            this.game.bgMusic.play();
        }
        
        this.add.image(0, 0, 'start-menu').setOrigin(0);

        const startButton = this.add.image(0, 0, 'start-menu-button').setOrigin(0).setInteractive({ pixelPerfect: true });

        startButton.on('pointerover', () => {
            this.tweens.add({
                targets: startButton,
                tint: 0xffff00,
                duration: 200,
                ease: 'Power2'
            });
        });

        startButton.on('pointerout', () => {
            this.tweens.add({
                targets: startButton,
                tint: 0xffffff, // White (original color)
                duration: 200,
                ease: 'Power2'
            });
        });

        startButton.on('pointerdown', () => {
            this.startSound.play();
            this.cameras.main.fadeOut(1000, 255, 255, 255);
            
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('Game');
            });
        });
    }
}