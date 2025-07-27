import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.cameras.main.fadeIn(2000, 255, 255, 255);
        this.add.image(0, 0, 'end-credits').setOrigin(0);
        this.setupPhotoIcon();  
        this.setupText();
        this.showCameraRoll();
    }

    setupPhotoIcon() {
        const gameWidth = this.registry.get('gameWidth');
        this.photoIcon = this.add.image(-945, 60, 'photo-icon-light').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        this.add.text(gameWidth / 2, 100, 'Camera Roll',
            {
                fontFamily: 'Pixel Operator, Arial, sans serif',
                fontSize: 100,
                fill: '#000000',
                align: 'left'
            }
        );
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
        const gameHeight = this.registry.get('gameHeight');
        this.add.image(gameWidth / 2 + 350, gameHeight / 2 + 200, 'photo-frame');
    }
}
