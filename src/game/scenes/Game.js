import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#c2f9abff');

        // this.add.image(960, 540, 'background').setAlpha(0.5).setScale(2);
        const bg = this.add.image(0, 175, 'game').setScale(1.5).setOrigin(0, 0);

        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

        this.input.on('pointermove', (pointer) => {

            const { width } = this.scale;

            this.cameras.main.scrollX = (pointer.x / width) * (bg.displayWidth - width);

        });

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
}
