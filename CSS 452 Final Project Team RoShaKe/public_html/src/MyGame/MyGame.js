/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    
    this.kSpriteSheet = "assets/PyoroWalk.png";
    this.kBG = "assets/PyoroBG.png";
    this.kFG = "assets/PyoroFG.png";
    
    this.BGWidth = 144;
    this.CanvasWidth = 256;
    this.CameraCenter = 128;
    this.HeroWidth = 16;
    
    this.mHero = null;
    this.mCamera = null;
    
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kSpriteSheet);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kFG);
};

MyGame.prototype.unloadScene = function () {
    
    gEngine.LayerManager.cleanUp();
    gEngine.Textures.unloadTexture(this.kSpriteSheet);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kFG);
};

MyGame.prototype.initialize = function () {
    
    this.mCamera = new Camera(
        vec2.fromValues(this.CameraCenter, this.CameraCenter), // position of the camera
        256,                       // width of camera
        [0, 0, 960, 960]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    
    this.mHero = new Hero(this.kSpriteSheet, this.HeroWidth * 4, this.CameraCenter, (this.CameraCenter - (this.BGWidth / 2) + this.HeroWidth));
    
    var bgR = new LightRenderable(this.kBG);
    bgR.setElementPixelPositions(0, this.CanvasWidth * 2, 0, this.CanvasWidth * 2);
    bgR.getXform().setSize(this.BGWidth, this.BGWidth);
    bgR.getXform().setPosition(this.CameraCenter, this.CameraCenter);
    this.mBG = new GameObject(bgR);
    
    var fgR = new SpriteRenderable(this.kFG);
    fgR.setElementPixelPositions(0, this.CanvasWidth * 4, 0, this.CanvasWidth * 4);
    fgR.getXform().setSize(this.CanvasWidth, this.CanvasWidth);
    fgR.getXform().setPosition(this.CameraCenter, this.CameraCenter);
    this.mFG = new GameObject(fgR);
    
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, this.mHero);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eBackground, this.mBG);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eHUD, this.mFG);
    
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    gEngine.LayerManager.drawAllLayers(this.mCamera);
    
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    
    this.mCamera.update();
    
    gEngine.LayerManager.updateAllLayers();
    this.mCamera.clampAtBoundary(this.mHero.getXform(), this.BGWidth / this.CanvasWidth);
    
    gEngine.DefaultResources.setGlobalAmbientIntensity(4);

};
