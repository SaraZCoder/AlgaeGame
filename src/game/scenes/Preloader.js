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
        this.load.image('end-credits',          'bg/end-credits.png');
        this.load.image('start-menu',           'bg/start-menu.png');
        this.load.image('start-menu-button',    'bg/start-menu-button.png');
        
        // Animation assets
        this.load.image('animation-friend',     'animation/friend.png');
        this.load.image('friend-intro',         'animation/friend-intro.png');
        this.load.image('animation-photo',      'animation/photo.png');
        this.load.image('continue-button',      'animation/continue-button.png');
        this.load.image('photo-frame',          'animation/photo-frame.png');

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

        // Load sounds
        this.load.audio('start-sound',          'sounds/start-sound.mp3');
        this.load.audio('photo-sound',          'sounds/photo-sound.mp3');
        this.load.audio('bg-music',             'sounds/cat-cafe-lofi.mp3');
        this.load.audio('blip',                 'sounds/blip.mp3');

        // Load dialogue from json file
        this.load.json('dialogue',              'data.json');

        // Load WebFont library
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'); 
    }

    create ()
    {
        // Wait for font to load before starting the game
        if (window.WebFont) {
            WebFont.load({
                custom: {
                    families: ['Pixel Operator', 'Pixel Operator Bold']
                },
                active: () => {
                    // Font loaded successfully
                    this.scene.start('MainMenu'); 
                },
                inactive: () => {
                    // Font failed to load, start anyway with fallback
                    console.warn('Custom font failed to load');
                    this.scene.start('MainMenu');
                }
            });
        } else {
            // WebFont not available, start with fallback
            this.scene.start('MainMenu');
        }
    }
}
