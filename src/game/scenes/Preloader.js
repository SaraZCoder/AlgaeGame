import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        const gameWidth = this.registry.get('gameWidth');
        const gameHeight = this.registry.get('gameHeight');
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(gameWidth/2, gameHeight/2, 'background').setScale(2);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(gameWidth/2, gameHeight/2, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle((gameWidth/2)-230, (gameHeight/2), 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        this.load.setPath('assets');

        // Load game assets
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
        
        // Load photos of algae products
        this.load.image('algae-fertilizer',   'photos/algae-fertilizer.jpg');
        this.load.image('algae-fish-tank',    'photos/algae-fish-tank.jpg');
        this.load.image('algae-food',         'photos/algae-food.jpg');
        this.load.image('algae-lotion',       'photos/algae-lotion.jpeg');
        this.load.image('algae-oil',          'photos/algae-oil.jpg');
        this.load.image('algae-pet-food',     'photos/algae-pet-food.jpg');
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
