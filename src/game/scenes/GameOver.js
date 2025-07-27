import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        const gameWidth = this.registry.get('gameWidth');
        const gameHeight = this.registry.get('gameHeight');

        this.cameras.main.fadeIn(2000, 255, 255, 255);

        this.add.image(0, 0, 'end-credits').setDisplaySize(1920, 1080).setOrigin(0);
    }
}
