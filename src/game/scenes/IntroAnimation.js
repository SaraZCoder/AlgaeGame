import { Scene } from 'phaser';

export class IntroAnimation extends Scene
{
    constructor ()
    {
        super('IntroAnimation');
    }

    create ()
    {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.add.image(0, 0, 'game-bg').setOrigin(0, 0);

        const rect = this.add.rectangle(0, 0, 1920, 1080, 0x000000, 0.5).setOrigin(0, 0);

        this.add.image(0, 0, 'animation-friend').setOrigin(0, 0);


        this.input.on('pointerdown', () => {
            this.scene.start('Game')
        });
    }
}
