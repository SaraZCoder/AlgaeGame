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
        // Load game assets
        this.load.setPath('assets');

        // Load scene backgrounds
        this.load.image('game-bg',              'bg/game-bg.png');
        this.load.image('end-credits',          'bg/end-credits-draft.png');
        this.load.image('start-menu',           'bg/start-menu-draft.png');

        // Animation assets
        this.load.image('animation-friend',     'animation/friend.png');
        this.load.image('animation-photo',      'animation/photo.png');

        // Photo Icon
        this.load.image('photo-icon-dark',      'photoIcon/dark.png');
        this.load.image('photo-icon-light',     'photoIcon/light.png');

        // Load algae items
        this.load.image('fertilizer',           'algaeItems/fertilizer.png');
        this.load.image('fish-tank',            'algaeItems/fish-tank.png');
        this.load.image('food',                 'algaeItems/food.png');
        this.load.image('lotion',               'algaeItems/lotion.png');
        this.load.image('oil',                  'algaeItems/oil.png');
        
        // Load photos of algae products
        this.load.image('algae-fertilizer',     'photos/algae-fertilizer.jpg');
        this.load.image('algae-fish-tank',      'photos/algae-fish-tank.jpg');
        this.load.image('algae-food',           'photos/algae-food.jpg');
        this.load.image('algae-lotion',         'photos/algae-lotion.jpeg');
        this.load.image('algae-oil',            'photos/algae-oil.jpg');

        // Load dialogue from json file
        this.load.json('dialogue',              'data.json');
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
