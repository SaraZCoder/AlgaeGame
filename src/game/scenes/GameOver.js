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

        this.cameras.main.setBackgroundColor(0x000000);

        this.add.image(gameWidth/2, gameHeight/2, 'background').setAlpha(0.5);

        this.add.text(gameWidth/2, gameHeight/2, 'THE END', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
    }
}
