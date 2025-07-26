import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.dialogue = null; // define dialogue property
        this.complete = false; // game complete?
        this.nopeTexts = [
            'Nope!',
            'This doesn\'t seem to have algae.',
            'Try somewhere else!',
            'It could contain algae in the future though…',
            'Nah.',
            'Not this.'
        ];

        // Constants
        this.DRAG_THRESHOLD = 10;
        this.SCORE_FONT_SIZE = '80px Arial';
        this.INSTRUCTION_FONT_SIZE = '48px Arial';
        this.MAX_SCORE = 5;
    }

    create() {
        this.setupDialogue();
        this.setupCamera();
        this.setupUI();
        this.setupInteractiveObjects();
        this.setupInputHandlers();
        this.startIntroSequence();
    }

    setupCamera() {
        this.photoIsVisible = false;
        this.cameras.main.setBackgroundColor('#c2f9abff');
        
        const bg = this.add.image(0, 0, 'game-bg').setOrigin(0, 0);
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
    }

    setupUI() {
        this.score = 0;
        const photoIcon = this.add.image(0, 0, 'photo-icon-dark').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        photoIcon.setScrollFactor(0);
        this.scoreMessage = this.add.text(this.cameras.main.width - 167, 62, '0/5', 
            { font: '80px Arial', fill: '#ffffffff' }
        );
        this.scoreMessage.setScrollFactor(0);
    }

    setupInteractiveObjects() {
        const interactiveItems = [
            { key: 'oil', photo: 'algae-oil', dialogue: 'Oil' },
            { key: 'food', photo: 'algae-food', dialogue: 'Food' },
            { key: 'fish-tank', photo: 'algae-fish-tank', dialogue: 'FishTank' },
            { key: 'lotion', photo: 'algae-lotion', dialogue: 'Lotion' },
            { key: 'fertilizer', photo: 'algae-fertilizer', dialogue: 'Fertilizer' }
        ];

        interactiveItems.forEach(item => {
            const gameObject = this.add.image(0, 0, item.key).setOrigin(0, 0).setInteractive({ pixelPerfect: true });
            gameObject.setData('hasBeenClicked', false);
            
            gameObject.on('pointerdown', () => {
                if (!gameObject.getData('hasBeenClicked')) {
                    this.showPhoto(item.photo, this.dialogue[item.dialogue]);
                    gameObject.setData('hasBeenClicked', true);
                } else {
                    this.showTemporaryText('You found this already!');
                }
            });
        });
    }

    setupInputHandlers() {
        this.input.on('pointermove', this.handleCameraDrag.bind(this));
        this.input.on('pointerup', this.handleMissedClicks.bind(this));
    }

    handleCameraDrag(pointer) {
        if (pointer.isDown && !this.photoIsVisible) {
            this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x);
        }
    }

    handleMissedClicks(pointer, gameObjects) {
        if (this.photoIsVisible) return;
        
        if (pointer.getDistance() < this.DRAG_THRESHOLD && gameObjects.length === 0) {
            const randText = this.getRandomText(this.nopeTexts);
            this.showTemporaryText(randText);
        }
    }

    async setupDialogue() {
        if (!this.dialogue) {
            this.dialogue = this.cache.json.get('dialogue');
            if (!this.dialogue) {
                await new Promise(resolve => {
                    this.cache.json.once('add', (cache, key) => {
                        if (key === 'dialogue') {
                            this.dialogue = this.cache.json.get('dialogue');
                            resolve();
                        }
                    });
                });
            }
        }
    }

    async startIntroSequence() {
        await this.setupDialogue();
        const introText = this.dialogue.Intro;
        this.friendAnimation(introText, 1);
    }

    showPhoto (photoName, textPages)
    {
        // Handle score update
        this.score += 1;
        this.scoreMessage.setText(this.score + '/5');
        this.photoIsVisible = true;

        this._addAnimation('animation-photo', photoName, textPages, () => {
            // This callback runs when the animation is complete
            if (this.score === 5) {
                this.complete = true;
                const outroText = this.dialogue.Conclusion;
                const photoIcon = this.add.image(0, 0, 'photo-icon-light').setOrigin(0, 0).setInteractive({ pixelPerfect: true }).setScrollFactor(0);
                this.scoreMessage.setText('');
                
                // Add pulsing glow effect
                this.tweens.add({
                    targets: photoIcon,
                    alpha: 0.5,
                    duration: 800,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1 // Infinite repeat
                });
                
                // Add click handler
                photoIcon.on('pointerdown', () => {
                    this.tweens.killTweensOf(photoIcon); // Stop the glow animation
                    photoIcon.setAlpha(1); // Reset alpha
                    this.friendAnimation(outroText, 2);
                });
            }
        });
    }
    
    friendAnimation (textPages = ['default text', 'yippee!'], numScene = 1) {
        this.photoIsVisible = true;
        
        if (numScene === 2) {
            this._addAnimation('animation-friend', '', textPages, () => {
                // Post-animation logic for scene 2
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                    this.scene.start('GameOver');
                });
            });
        } else {
            // No delay for other scenes
            this._addAnimation('animation-friend', '', textPages, () => {
                // Post-animation logic for scene 1
                if (numScene === 1) {
                    const gameInstr = 'Click and drag to move around. Click on items to explore.';
                    const instr = this.add.text(this.cameras.main.width / 2, 100, gameInstr, 
                        { 
                            font: '48px Arial', 
                            color: '#000000', 
                            backgroundColor: '#ffffff',
                            padding: { x: 10, y: 5 }
                        }
                    ).setOrigin(0.5, 0).setAlpha(0);
                    
                    instr.setScrollFactor(0);
                    
                    this.tweens.add({
                        targets: instr,
                        alpha: 1,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            this.input.once('pointerdown', () => {
                                instr.destroy();
                            });
                        }
                    });
                }
            });
        }
    }

    _addAnimation (image, photoName = '', textPages, onAnimationComplete = null)
    {
        // bg is either 'animation-friend' or 'animation-photo'
        // Show photo and caption for input photo name and text
        const bg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0xffffff, 0.5).setAlpha(0);
        bg.setScrollFactor(0).setInteractive();

        const photoFrame = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, image).setAlpha(0);
        photoFrame.setScrollFactor(0).setInteractive({ pixelPerfect: true });
        
        const text = this.add.text(this.cameras.main.width / 2 - 550, this.cameras.main.height / 2 + 200, '', { font: '40px Arial', fill: '#000000', wordWrap: { width: 1080 }, align: 'left' }).setOrigin(0, 0);
        text.setScrollFactor(0).setAlpha(0);
        
        const friendText = this.add.text(photoFrame.x - 487, photoFrame.y + 97, 'Friend', { font: '40px Arial', fill: '#000000' });
        friendText.setScrollFactor(0).setAlpha(0);

        const continueText = this.add.text(photoFrame.x - 150, photoFrame.y + 425, 'Click anywhere to continue', { font: '24px Arial', fill: '#515151ff', align: 'center' }).setOrigin(0);
        continueText.setScrollFactor(0).setAlpha(0);
        
        const targets = [bg, photoFrame, text, friendText, continueText]; // targets for animation

        let itemPhoto;
        if (photoName) {
            itemPhoto = this.add.image(photoFrame.x, photoFrame.y - 224, photoName).setAlpha(0);
            itemPhoto.setScrollFactor(0);
            itemPhoto.setDisplaySize(1022, 486); // TODO: might need to change if photo already positioned

            targets.push(itemPhoto);
        }

        // Add animation
        this.tweens.add({
            targets: targets,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                let currentPage = 0;
                let isTyping = true;

                this.typewriterEffect(text, textPages[currentPage], () => {
                    isTyping = false;
                });

                const clickHandler = () => {
                    if (isTyping) {
                        this.typewriterEffect(text, textPages[currentPage], () => {
                            isTyping = false;
                        }, true);
                    } else {
                        currentPage++;
                        if (currentPage < textPages.length) {
                            isTyping = true;
                            this.typewriterEffect(text, textPages[currentPage], () => {
                                isTyping = false;
                            });
                        } else {
                            this.input.off('pointerdown', clickHandler); // Important: remove listener
                            this.tweens.add({
                                targets: targets,
                                alpha: 0,
                                duration: 500,
                                onComplete: () => {
                                    bg.destroy();
                                    photoFrame.destroy();
                                    text.destroy();
                                    if (itemPhoto) {
                                        itemPhoto.destroy();
                                    }
                                    this.photoIsVisible = false;
                                    
                                    // Call the completion callback here
                                    if (onAnimationComplete) {
                                        onAnimationComplete();
                                    }
                                }
                            });
                        }
                    }
                };
                this.input.on('pointerdown', clickHandler);
            }
        });
    }
    
    typewriterEffect(textObject, text, onComplete, skip = false) {
        if (textObject.typewriterTimer) {
            textObject.typewriterTimer.remove();
        }

        textObject.setText('');
        const words = text.split(' ');
        const baseDelay = 50;
        const perCharDelay = 15;

        if (skip) {
            textObject.setText(text);
            if (onComplete) {
                onComplete();
            }
            return;
        }

        let i = 0;
        const addNextWord = () => {
            if (i >= words.length) {
                textObject.typewriterTimer = null;
                if (onComplete) {
                    onComplete();
                }
                return;
            }

            const word = words[i];
            textObject.text += word + (i < words.length - 1 ? ' ' : '');
            i++;

            const delay = baseDelay + (word.length * perCharDelay);
            textObject.typewriterTimer = this.time.delayedCall(delay, addNextWord);
        };

        addNextWord();
    }

    showTemporaryText(text) {
        if (this.complete === true) {
            text = 'You found all of the items! Please click your camera roll to finish.'
        }
        const textObject = this.add.text(
            this.cameras.main.centerX,
            100, // At the top of the screen
            text,
            {
                font: '48px Arial',
                fill: '#000000', // Black text
                backgroundColor: '#ffffff', // White background for readability
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5, 0);

        textObject.setScrollFactor(0); // Keep it fixed on the screen

        this.tweens.add({
            targets: textObject,
            alpha: 0,
            duration: 1000 +(100 * text.length),
            ease: 'Power2',
            delay: 1000,
            onComplete: () => {
                textObject.destroy();
            }
        });
    }

    getRandomText(textArray) {
        if (textArray.length === 0) {
            return undefined;
        }

        const randomIndex = Math.floor(Math.random() * textArray.length);
        return textArray[randomIndex];
    }

}