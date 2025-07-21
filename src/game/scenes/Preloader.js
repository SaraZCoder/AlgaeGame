import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(960, 540, 'background').setScale(2);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(960, 540, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(960-230, 540, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('start-menu', 'start-menu-draft.png');
        this.load.image('animation-friend', 'animation-friend.png');
        this.load.image('animation-photo', 'animation-photo.png');
        this.load.image('game-bg', 'game-bg.png');
        this.load.image('end-credits', 'end-credits-draft.png');
        this.load.image('photo-icon-dark', 'photo-icon-dark.png');
        this.load.image('photo-icon-light', 'photo-icon-light.png');
        this.load.image('fertilizer', 'fertilizer.png');
        this.load.image('fish-tank', 'fish-tank.png');
        this.load.image('food', 'food.png');
        this.load.image('lotion', 'lotion.png');
        this.load.image('oil', 'oil.png');
        this.load.image('pet-food', 'pet-food.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
