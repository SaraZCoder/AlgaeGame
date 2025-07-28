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
        this.setupText();
        this.showCameraRoll();
    }

    setupText() {
        const gameWidth = this.registry.get('gameWidth');
        const gameHeight = this.registry.get('gameHeight');
        this.add.text(100, 100, 'End Credits',
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
        this.add.text(100, 340, 'Sara Zhao\nCindy Zhao\n\n\n\nThe Algae Academy\nMrs. P',
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
        let prevButtonText = this.add.text(gameWidth - 435, 155, 'Prev', this.buttonStyles).setOrigin(0).setInteractive();
        let nextButton = this.add.image(0, 0, 'next-button').setOrigin(0).setInteractive({pixelPerfect: true});
        let nextButtonText = this.add.text(gameWidth - 295, 155, 'Next', this.buttonStyles).setOrigin(0).setInteractive();
        
        // Set up algae photo metadata
        const algaePhotos = [
            // { key: 'AlgaeOil', photo: 'cam-oil', dialogue: 'Oil' },
            { key: 'SpamMusubi', photo: 'cam-food', dialogue: 'Food' },
            { key: 'FishTank', photo: 'cam-fish-tank', dialogue: 'FishTank' },
            { key: 'AlgaeLotion', photo: 'cam-lotion', dialogue: 'Lotion' },
            // { key: 'AlgaeFertilizer', photo: 'cam-fertilizer', dialogue: 'Fertilizer' }
        ];

        var index = 0;
        var gameObject = this.add.image(0, 0, algaePhotos[index].photo).setOrigin(0, 0);
        var imageName = algaePhotos[index].key + '.png';
        var imageText = this.add.text(gameWidth / 2 - 140, 155, imageName, this.buttonStyles).setOrigin(0);

        prevButton.on('pointerdown', () => {
            console.log('prevButton clicked!');
            index -= 1;
            if (index < 0) index = algaePhotos.length - 1;
            gameObject.destroy();
            imageText.destroy();
            gameObject = this.add.image(0, 0, algaePhotos[index].photo).setOrigin(0, 0);
            imageName = algaePhotos[index].key + '.png';
            imageText = this.add.text(gameWidth / 2 - 140, 155, imageName, this.buttonStyles).setOrigin(0);
        });
        
        nextButton.on('pointerdown', () => {
            console.log('nextButton clicked!');
            index += 1;
            if (index > (algaePhotos.length - 1)) index = 0;
            gameObject.destroy();
            imageText.destroy();
            gameObject = this.add.image(0, 0, algaePhotos[index].photo).setOrigin(0, 0);
            imageName = algaePhotos[index].key + '.png';
            imageText = this.add.text(gameWidth / 2 - 140, 155, imageName, this.buttonStyles).setOrigin(0);
        });
    }
}
