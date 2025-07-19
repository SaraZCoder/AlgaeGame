import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(960, 540, 'background').setScale(2);

        this.add.text(960, 350, 'All Around Algae', {
            fontFamily: 'Arial Black', fontSize: 100, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(960, 650, 'Click to Start', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, backgroundColor: '#92f8c8ff',
            padding: { left: 15, right: 15, top: 10, bottom: 10 },
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
