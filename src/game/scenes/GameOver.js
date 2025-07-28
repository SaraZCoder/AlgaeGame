import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
        this.buttonStyles = {
            fontFamily: 'Pixel Operator, Arial, sans serif',
            fontSize: 40,
            fill: '#ffffff',
            aligh: 'left'
        };
    }

    create ()
    {
        this.cameras.main.fadeIn(2000, 255, 255, 255);
        this.add.image(0, 0, 'end-credits').setOrigin(0);
        this.startSound = this.sound.add('start-sound', { volume: 0.1 });
        this.setupText();
        this.showCameraRoll();
        this.addReplay();
    }

    setupText() {
        const gameWidth = this.registry.get('gameWidth');
        const gameHeight = this.registry.get('gameHeight');
        this.add.text(100, 100, 'Credits',
            {
                fontFamily: 'Pixel Operator Bold, Arial, sans serif',
                fontSize: 100,
                fill: '#000000',
                align: 'left'
            }
        );
        this.add.text(100, 275, 'Developers\n\n\n\n\nSpecial Thanks',
            {
                fontFamily: 'Pixel Operator Bold, Arial Bold, sans serif',
                fontSize: 60,
                fill: '#000000',
                align: 'left'
            }
        );
        this.add.text(100, 340, 'Sara Z.\nCindy Z.\n\n\n\nThe Algae Academy\nMrs. P',
            {
                fontFamily: 'Pixel Operator, Arial, sans serif',
                fontSize: 60,
                fill: '#000000',
                align: 'left'
            }
        );
        this.add.text(gameWidth - 525, gameHeight - 110, '\u00A9 SaraZGames 2025',
            {
                fontFamily: 'Pixel Operator, Arial, sans serif',
                fontSize: 60,
                fill: '#000000',
                align: 'center',
                wordWrap: { width: 450 }
            }
        );
    }

    showCameraRoll() {
        const gameWidth = this.registry.get('gameWidth');

        // Define the buttons
        let prevButton = this.add.image(0, 0, 'prev-button').setOrigin(0).setInteractive({pixelPerfect: true});
        let prevButtonText = this.add.text(gameWidth - 462, 153, 'Prev', this.buttonStyles).setOrigin(0).setInteractive();
        let nextButton = this.add.image(0, 0, 'next-button').setOrigin(0).setInteractive({pixelPerfect: true});
        let nextButtonText = this.add.text(gameWidth - 276, 153, 'Next', this.buttonStyles).setOrigin(0).setInteractive();
        
        // Set up algae photo metadata
        const algaePhotos = [
            { key: 'AlgaeOil', photo: 'cam-oil', dialogue: 'Oil' },
            { key: 'SpamMusubi', photo: 'cam-food', dialogue: 'Food' },
            { key: 'FishTank', photo: 'cam-fish-tank', dialogue: 'FishTank' },
            { key: 'AlgaeLotion', photo: 'cam-lotion', dialogue: 'Lotion' },
            { key: 'AlgaeFertilizer', photo: 'cam-fertilizer', dialogue: 'Fertilizer' }
        ];

        var index = 0;
        var gameObject = this.add.image(0, 0, algaePhotos[index].photo).setOrigin(0, 0);
        var imageName = algaePhotos[index].key + '.png';
        var imageText = this.add.text(gameWidth / 2 - 140, 155, imageName, this.buttonStyles).setOrigin(0);

        prevButton.on('pointerdown', () => {
            index -= 1;
            if (index < 0) index = algaePhotos.length - 1;
            gameObject.destroy();
            imageText.destroy();
            gameObject = this.add.image(0, 0, algaePhotos[index].photo).setOrigin(0, 0);
            imageName = algaePhotos[index].key + '.png';
            imageText = this.add.text(gameWidth / 2 - 140, 155, imageName, this.buttonStyles).setOrigin(0);
        });
        prevButtonText.on('pointerdown', () => {
            index -= 1;
            if (index < 0) index = algaePhotos.length - 1;
            gameObject.destroy();
            imageText.destroy();
            gameObject = this.add.image(0, 0, algaePhotos[index].photo).setOrigin(0, 0);
            imageName = algaePhotos[index].key + '.png';
            imageText = this.add.text(gameWidth / 2 - 140, 155, imageName, this.buttonStyles).setOrigin(0);
        });
        
        nextButton.on('pointerdown', () => {
            index += 1;
            if (index > (algaePhotos.length - 1)) index = 0;
            gameObject.destroy();
            imageText.destroy();
            gameObject = this.add.image(0, 0, algaePhotos[index].photo).setOrigin(0, 0);
            imageName = algaePhotos[index].key + '.png';
            imageText = this.add.text(gameWidth / 2 - 140, 155, imageName, this.buttonStyles).setOrigin(0);
        });
        nextButtonText.on('pointerdown', () => {
            index += 1;
            if (index > (algaePhotos.length - 1)) index = 0;
            gameObject.destroy();
            imageText.destroy();
            gameObject = this.add.image(0, 0, algaePhotos[index].photo).setOrigin(0, 0);
            imageName = algaePhotos[index].key + '.png';
            imageText = this.add.text(gameWidth / 2 - 140, 155, imageName, this.buttonStyles).setOrigin(0);
        });
    }
    
    addReplay() {
        let replayButton = this.add.image(0, 0, 'replay-button').setOrigin(0).setInteractive({ pixelPerfect: true });
        replayButton.on('pointerover', () => {
            this.tweens.add({
                targets: replayButton,
                tint: 0xffff00,
                duration: 200,
                ease: 'Power2'
            });
        });

        replayButton.on('pointerout', () => {
            this.tweens.add({
                targets: replayButton,
                tint: 0xffffff, // White (original color)
                duration: 200,
                ease: 'Power2'
            });
        });

        replayButton.on('pointerdown', () => {
            this.startSound.play();
            this.cameras.main.fadeOut(1000, 255, 255, 255);
            
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('MainMenu');
            });
        });
    }
}
