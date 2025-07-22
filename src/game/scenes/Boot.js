import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg-draft.png');
    }

    create ()
    {
        // Set game dimensions in the registry
        this.registry.set('gameWidth', this.sys.game.config.width);
        this.registry.set('gameHeight', this.sys.game.config.height);

        this.scene.start('Preloader');
    }
}
