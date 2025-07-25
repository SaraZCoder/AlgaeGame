import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const gameWidth = this.registry.get('gameWidth');
        const gameHeight = this.registry.get('gameHeight');

        this.add.image(gameWidth / 2, gameHeight / 2, 'background').setDisplaySize(1920, 1080);

        this.add.text(gameWidth / 2, gameHeight / 2 - 100, 'All Around Algae', {
            fontFamily: 'Arial Black', fontSize: 100, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const startButton = this.add.text(gameWidth / 2, gameHeight / 2 + 200, 'Click to Start', {
            fontFamily: 'Arial Black', fontSize: 62, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, backgroundColor: '#92f8c8ff',
            padding: { left: 15, right: 15, top: 10, bottom: 10 },
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Game');
        });
    }
}
