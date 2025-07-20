import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(768, 432, 'background');
        // this.add.image(960, 540, 'start-menu').setAlpha(0.5).setScale(2);

        this.add.text(768, 300, 'All Around Algae', {
            fontFamily: 'Arial Black', fontSize: 100, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const startButton = this.add.text(768, 600, 'Click to Start', {
            fontFamily: 'Arial Black', fontSize: 62, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, backgroundColor: '#92f8c8ff',
            padding: { left: 15, right: 15, top: 10, bottom: 10 },
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Game')
        });
    }
}
