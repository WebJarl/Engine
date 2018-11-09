(function() {
    var particles = [];

    gameEngine.particleEffects = new function() {
        this.create = function(renderable, life, morphFunction) {
            particles.push({
                renderable: renderable,
                life: life,
                morphFunction: morphFunction
            });
        };
        this.tick = function(dt) {
            for(var i in particles) {
                var particle = particles[i];
                if(particle.life <= 0) {
                    gameEngine.renderer.destroyRenderable(particle.renderable);
                    particles.splice(i, 1);
                } else {
                    particle.life -= dt;
                    if(particle.morphFunction) {
                        particle.renderable = particle.morphFunction(particle.renderable, dt);
                    }
                }
            }
        };
    };
}());
