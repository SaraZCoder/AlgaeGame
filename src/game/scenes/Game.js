import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.dialogue = null; // define dialogue property
        this.complete = false; // game complete?
        this.notification = false; // notification not shown
        this.nopeTexts = [
            'Nope!',
            'This doesn\'t seem to have algae.',
            'Try somewhere else!',
            'It could contain algae in the future though…',
            'Nah.',
            'Not this.'
        ];

        // Constants - Separate font families and sizes
        this.DRAG_THRESHOLD = 10;
        this.FONT_FAMILY = 'Pixel Operator, Arial, sans-serif';
        this.SCORE_FONT_SIZE = '80px';
        this.INSTRUCTION_FONT_SIZE = '60px';
        this.TEXT_FONT_SIZE = '48px';
        this.MAX_SCORE = 5;
    }

    create() {
        this.setupSounds();
        this.setupDialogue();
        this.setupCamera();
        this.setupUI();
        this.setupInteractiveObjects();
        this.setupInputHandlers();
        this.startIntroSequence();
        this.setupMuteButton();
    }
    
    setupSounds() {
        var soundEffectConfig = {
            volume: 0.1,
            rate: 0.75
        }
        var bgMusicConfig = {
            volume: 0.1,
            rate: 1,
            mute: false,
            delay: 0,
            repeat: -1
        }
        this.photoSound = this.sound.add('photo-sound', soundEffectConfig);
        this.incorrectSound = this.sound.add('incorrect-sound', {volume: 0.1});
        this.bgMusic = this.sound.add('bg-music', bgMusicConfig);
        this.blip = this.sound.add('blip', { volume: 0.1 });
    }

    setupCamera() {
        this.photoIsVisible = false;
        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 1)');

        const bg = this.add.image(0, 0, 'game-bg').setOrigin(0, 0).setAlpha(0);
        this.tweens.add({
            targets: bg,
            duration: 500,
            delay: 500,
            alpha: 1
        })
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
    }

    setupUI() {
        this.score = 0;
        const photoIcon = this.add.image(0, 0, 'photo-icon-dark').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        photoIcon.setAlpha(0);
        photoIcon.setScrollFactor(0);
        this.tweens.add({
            targets: photoIcon,
            duration: 500,
            delay: 500,
            alpha: 1
        })
        this.scoreMessage = this.add.text(this.cameras.main.width - 160, 65, '0/5', 
            { fontFamily: this.FONT_FAMILY, fontSize: this.SCORE_FONT_SIZE, fill: '#ffffffff' }
        );
        this.scoreMessage.setScrollFactor(0);
    }

    setupInteractiveObjects() {
        // key should be the name of the algae item in Preloader.js
        const interactiveItems = [
            { key: 'oil', photo: 'algae-oil', dialogue: 'Oil' },
            { key: 'food', photo: 'algae-food', dialogue: 'Food' },
            { key: 'fish-tank', photo: 'algae-fish-tank', dialogue: 'FishTank' },
            { key: 'lotion', photo: 'algae-lotion', dialogue: 'Lotion' },
            { key: 'fertilizer', photo: 'algae-fertilizer', dialogue: 'Fertilizer' }
        ];

        const items = [];

        interactiveItems.forEach(item => {
            const gameObject = this.add.image(0, 0, item.key).setOrigin(0, 0).setInteractive({ pixelPerfect: true });
            gameObject.setAlpha(0);
            gameObject.setData('hasBeenClicked', false);
            items.push(gameObject);
            
            gameObject.on('pointerdown', () => {
                if (!gameObject.getData('hasBeenClicked')) {
                    this.showPhoto(item.photo, this.dialogue[item.dialogue]);
                    gameObject.setData('hasBeenClicked', true);
                    this.photoSound.rate += 0.05;
                    this.photoSound.play();
                } else {
                    this.showTemporaryText('You found this already!');
                }
            });
        });

        this.tweens.add({
            targets: items,
            duration: 500,
            delay: 500,
            alpha: 1
        })
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

    setupMuteButton() {
        const muteButton = this.add.image(0, 0, 'mute-off').setOrigin(0).setAlpha(0);
        muteButton.setInteractive( { pixelPerfect: true });
        muteButton.setScrollFactor(0);

        this.tweens.add({
            targets: muteButton,
            duration: 500,
            delay: 500,
            alpha: 1
        })

        muteButton.on('pointerdown', () => {
            this.sound.mute = !this.sound.mute; // Toggles the mute state
            // You can also update the button's appearance here to reflect the state
            if (this.sound.mute) {
                muteButton.setTexture('mute-off'); // Change to a 'muted' icon
            } else {
                muteButton.setTexture('mute-on'); // Change back to 'unmuted' icon
            }
        });
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
                    this.photoSound.play();
                });
            }
        });
    }
    
    friendAnimation (textPages = ['default text', 'yippee!'], numScene = 1) {
        this.photoIsVisible = true;
        
        if (numScene === 2) {
            this._addAnimation('animation-friend', '', textPages, () => {
                // Post-animation logic for scene 2
                this.cameras.main.fadeOut(1000, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                    this.scene.start('GameOver');
                });
            });
        } else {
            // No delay for other scenes
            this._addAnimation('friend-intro', '', textPages, () => {
                // Post-animation logic for scene 1
                if (numScene === 1) {
                    const gameInstr = 'Click and drag to move around. Click on items to explore.';
                    this.showTemporaryText(gameInstr, true);
                    this.bgMusic.play();
                }
            });
        }
    }

    _addAnimation (image, photoName = '', textPages, onAnimationComplete = null)
    {
        // bg is either 'animation-friend' or 'animation-photo'
        // Show photo and caption for input photo name and text
        this.bgMusic.pause();

        const bg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0xffffff, 0.9).setAlpha(0);
        bg.setScrollFactor(0).setInteractive();

        const photoFrame = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, image).setAlpha(0);
        photoFrame.setScrollFactor(0).setInteractive({ pixelPerfect: true });
        
        const text = this.add.text(this.cameras.main.width / 2 - 550, this.cameras.main.height / 2 + 200, '', 
            { fontFamily: this.FONT_FAMILY, fontSize: this.TEXT_FONT_SIZE, fill: '#000000', wordWrap: { width: 1080 }, align: 'left' }).setOrigin(0, 0);
        text.setScrollFactor(0).setAlpha(0);
        
        const friendText = this.add.text(photoFrame.x - 495, photoFrame.y + 95, 'Friend', 
            { fontFamily: 'Pixel Operator Bold, Arial, sans serif', fontSize: this.TEXT_FONT_SIZE, fill: '#000000' });
        friendText.setScrollFactor(0).setAlpha(0);
        
        const targets = [bg, photoFrame, text, friendText]; // targets for animation

        let itemPhoto;
        if (photoName) {
            itemPhoto = this.add.image(photoFrame.x, photoFrame.y, photoName).setAlpha(0);
            itemPhoto.setScrollFactor(0);

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
                        // Remove triangle when skipping
                        if (text.continueTriangle) {
                            text.continueTriangle.destroy();
                            text.continueTriangle = null;
                        }
                        this.typewriterEffect(text, textPages[currentPage], () => {
                            isTyping = false;
                        }, true);
                    } else {
                        // Remove triangle when advancing
                        if (text.continueTriangle) {
                            text.continueTriangle.destroy();
                            text.continueTriangle = null;
                        }
                        
                        currentPage++;
                        if (currentPage < textPages.length) {
                            isTyping = true;
                            this.typewriterEffect(text, textPages[currentPage], () => {
                                isTyping = false;
                            });
                        } else {
                            this.input.off('pointerdown', clickHandler);
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
                                    // Triangle will be automatically destroyed with text object
                                    this.photoIsVisible = false;
                                    this.bgMusic.resume();
                                    
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

        // Remove existing triangle if it exists
        if (textObject.continueTriangle) {
            textObject.continueTriangle.destroy();
            textObject.continueTriangle = null;
        }

        textObject.setText('');
        const words = text.split(' ');
        const baseDelay = 50;
        const perCharDelay = 15;

        if (skip) {
            text = text.replaceAll('<i>', '');
            text = text.replaceAll('</i>', '');
            textObject.setText(text);
            this.showContinueTriangle(textObject);
            if (onComplete) {
                onComplete();
            }
            return;
        }

        let i = 0;
        const addNextWord = () => {
            if (i >= words.length) {
                textObject.typewriterTimer = null;
                this.showContinueTriangle(textObject);
                if (onComplete) {
                    onComplete();
                }
                return;
            }

            var word = words[i];
            // TODO: Add italic styling to algae genus
            // The bottom solution only works without skipping
            if (word.includes('<i>') || word.includes('</i>')) {
                word = word.replace('<i>', '');
                word = word.replace('</i>', '');
                console.log('word successfully edited!');
            }
            textObject.text += word + (i < words.length - 1 ? ' ' : '');
            i++;
            if ((i+1) % 2 === 0) {
                this.blip.play();
            }

            const delay = baseDelay + (word.length * perCharDelay);
            textObject.typewriterTimer = this.time.delayedCall(delay, addNextWord);
        };
        addNextWord();
    }

    showContinueTriangle(textObject) {
        // Create a triangle shape
        const triangle = this.add.image(0, 0, 'continue-button').setOrigin(0);
        
        triangle.setScrollFactor(0);
        triangle.setAlpha(0);
        
        // Store reference to triangle on the text object
        textObject.continueTriangle = triangle;
        
        // Fade in the triangle
        this.tweens.add({
            targets: triangle,
            alpha: 1,
            duration: 300,
            onComplete: () => {}
        });
    }

    showTemporaryText(text, clickToContinue = false) {
        if (this.complete === true) {
            text = 'You found everything! Please click your camera roll to finish.'
        }

        if (this.notification === false) {
            this.notification = true;
            if (!clickToContinue && !this.complete) {
                this.incorrectSound.play();
            } else {
                if (!clickToContinue) {
                    this.photoSound.play();
                }
            }
            // Create the text first to measure its size
            const textObject = this.add.text(
                this.cameras.main.centerX,
                100,
                text,
                {
                    fontFamily: this.FONT_FAMILY, 
                    fontSize: this.INSTRUCTION_FONT_SIZE,
                    fill: '#000000',
                    padding: { x: 10, y: 5 }
                }
            ).setOrigin(0.5, 0);
    
            // Create rounded rectangle background
            const bg = this.add.graphics();
            bg.fillStyle(0xffffff); // White background
            bg.fillRoundedRect(
                textObject.x - textObject.width / 2 - 10, // x position (adjust for padding)
                textObject.y - 5, // y position (adjust for padding)
                textObject.width + 20, // width (text width + padding)
                textObject.height + 10, // height (text height + padding)
                10 // corner radius
            );
            
            // Make sure text appears on top of background
            textObject.setDepth(1);
            bg.setDepth(0);
            
            // Set scroll factor for both
            textObject.setScrollFactor(0);
            bg.setScrollFactor(0);
    
            // Animate both text and background together
            if (clickToContinue) {
                this.input.once('pointerdown', () => {
                    this.tweens.add({
                        targets: [textObject, bg],
                        alpha: 0,
                        duration: 1000 + (25 * text.length),
                        ease: 'Power2',
                        delay: 1000,
                        onComplete: () => {
                            textObject.destroy();
                            bg.destroy();
                            this.notification = false;
                        }
                    });
                });
            } else {
                this.tweens.add({
                    targets: [textObject, bg],
                    alpha: 0,
                    duration: 1000 + (50 * text.length),
                    ease: 'Power2',
                    delay: 1000,
                    onComplete: () => {
                        textObject.destroy();
                        bg.destroy();
                        this.notification = false;
                    }
                });
            }
        }
    }

    getRandomText(textArray) {
        if (textArray.length === 0) {
            return undefined;
        }

        const randomIndex = Math.floor(Math.random() * textArray.length);
        return textArray[randomIndex];
    }

}