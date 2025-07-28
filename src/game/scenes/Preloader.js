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
        this.cameras.main.setBackgroundColor('#ffffff');

        //  A simple progress bar. This is the outline of the bar.
        const progressBar = this.add.image(gameWidth/2, gameHeight/2, 'progress-bar');

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle((gameWidth/2)-486, (gameHeight/2) - 8, 4, 74, 0xb5eece).setBelow(progressBar);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (980 * progress);

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
        this.load.image('next-button',          'bg/next-button.png');
        this.load.image('prev-button',          'bg/prev-button.png');
        this.load.image('mute-off',             'bg/mute-off.png');
        this.load.image('mute-on',              'bg/mute-on.png');
        
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
        this.load.image('algae-fish-tank',      'photos/fish-tank.png');
        this.load.image('algae-food',           'photos/food.png');
        this.load.image('algae-lotion',         'photos/lotion.png');
        this.load.image('algae-oil',            'photos/algae-oil.jpg');
        
        // Load camera roll photos
        // this.load.image('cam-fertilizer',       'end-scene/cam-fertilizer.png');
        this.load.image('cam-fish-tank',        'end-scene/cam-fish-tank.png');
        this.load.image('cam-food',             'end-scene/cam-food.png');
        this.load.image('cam-lotion',           'end-scene/cam-lotion.png');
        // this.load.image('cam-oil',              'end-scene/cam-oil.png');

        // Load sounds
        this.load.audio('start-sound',          'sounds/start-sound.mp3');
        this.load.audio('photo-sound',          'sounds/photo-sound.mp3');
        this.load.audio('incorrect-sound',      'sounds/incorrect.mp3');
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
                    // this.scene.start('MainMenu'); 
                    this.cameras.main.fadeOut(1000, 255, 255, 255);
            
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                        this.scene.start('MainMenu');
                    });
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
