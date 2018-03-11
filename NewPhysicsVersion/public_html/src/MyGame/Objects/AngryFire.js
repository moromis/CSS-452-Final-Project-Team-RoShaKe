/*jslint node: true, vars: true */
/*global gEngine, GameObject, LightRenderable,vec3,Fire,Light, IllumRenderable, HelperFunctions, SpriteAnimateRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function AngryFire(spriteTexture, heroPos,bg, igloo, lightmanager, blockManager) {

    this.heroPos = heroPos;
    this.kDelta = 1;
    this.downSize = 1;
    this.interp = null;
    this.name = "AngryFire";
    this.blockManager = blockManager;
  
    Fire.call(this, spriteTexture,bg,igloo, lightmanager);

    this.mlight.setLightType(Light.eLightType.eSpotLight);
    this.mlight.setNear(300);
    this.mlight.setFar(350);
    this.mlight.setInner(1.4);
    this.mlight.setOuter(1.6);
    this.mlight.setIntensity(15);
    this.mlight.setColor([1,0,1,1]);
    
    this.mSprite.getXform().setSize(this.size, this.size);
    this.mSprite.setElementPixelPositions(0, this.size, 0, this.size);
}
gEngine.Core.inheritPrototype(AngryFire, Fire);

AngryFire.prototype.update = function () {

    //call parent update
    Fire.prototype.update.call(this);
    var pos = this.getXform().getPosition();

    //update X position
    this.rotateObjPointTo(this.heroPos, 0.1);
    if (pos[0] > this.heroPos[0])
        this.getXform().incXPosBy(-1);
    else if (pos[0] < this.heroPos[0])
        this.getXform().incXPosBy(1);

    var fdr = this.getCurrentFrontDir();
    var dir = vec3.fromValues(fdr[0], fdr[1], this.mlight.getDirection()[2]);
    this.mlight.setDirection(dir);
};

AngryFire.prototype.handleCollision = function (otherObjectType) {

Fire.prototype.handleCollision.call(this,otherObjectType);

    if (otherObjectType === "Water") {
        this.shouldScore = true;
        this.blockManager.reset();
        this.scoreAmount = this.getXform().getPosition()[1] * 2;
    }
};

