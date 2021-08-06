//TODO: remove it and check the warning again
/* eslint-disable react-hooks/exhaustive-deps */

import * as PIXI from "pixi.js-legacy";
import { useEffect } from "react";
import catFrames from "../resources/cat.png";

const Game = (props) => {
  useEffect(() => {
    const gameCanvas = document.createElement("canvas");
    gameCanvas.width = 640;
    gameCanvas.height = 640;

    // Important - following 3 lines allow us to "overlay" the game render on top of our actual bitmap image
    gameCanvas.style = "z-index:2;margin-left:-640px;";
    const gameRoot = document.getElementById("game_background");
    gameRoot.appendChild(gameCanvas);

    // Following is the game logic written by Jason

    // Load textures
    const app = new PIXI.Application({
      width: 640,
      height: 640,
      backgroundAlpha: 0,
      view: gameCanvas,
      antialias: false,
    });

    // Allows cat to be pixelated - since it's our style
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    app.view.setAttribute("tabindex", 0);

    class Keyboard {
      constructor() {
        this.pressed = {};
      }

      watch(el) {
        el.addEventListener("keydown", (e) => {
          this.pressed[e.key] = true;
        });
        el.addEventListener("keyup", (e) => {
          this.pressed[e.key] = false;
        });
      }
    }

    app.loader.add("character", catFrames);

    app.loader.load((loader, resources) => {
      let kb = new Keyboard();
      kb.watch(app.view);

      //Character
      let characterFrames = [];
      for (let i = 0; i < 12; i++) {
        let x = i % 3;
        let y = Math.floor(i / 3);
        characterFrames[i] = new PIXI.Texture(
          resources.character.texture,
          new PIXI.Rectangle(x * 32, y * 32, 32, 32)
        );

        const SCALE = 2;
        const blob = new PIXI.Sprite(characterFrames[0]);
        blob.scale.x = SCALE;
        blob.scale.y = SCALE;

        app.stage.addChild(blob);
        let character = {
          x: 320,
          y: 240,
          vx: 0,
          vy: 0,
          direction: 0,
          cycles: {
            runLeft: [3, 4, 5],
            runRight: [6, 7, 8],
            runDown: [0, 1, 2],
            runUp: [9, 10, 11],
          },
        };

        app.ticker.add((time) => {
          blob.x = character.x;
          blob.y = character.y;
          character.x += character.vx;
          character.y += character.vy;

          if (character.vx > 0) {
            character.vx -= 1;
          }
          if (character.vx < 0) {
            character.vx += 1;
          }

          if (character.vy > 0) {
            character.vy -= 1;
          }
          if (character.vy < 0) {
            character.vy += 1;
          }

          let characterFrame = 0;
          if (character.vx > 0) {
            characterFrame =
              character.cycles.runRight[Math.floor(Date.now() / 100) % 3];
          } else if (character.vx < 0) {
            characterFrame =
              character.cycles.runLeft[Math.floor(Date.now() / 100) % 3];
          } else if (character.vy < 0) {
            characterFrame =
              character.cycles.runUp[Math.floor(Date.now() / 100) % 3];
          } else if (character.vx > 0) {
            characterFrame =
              character.cycles.runDown[Math.floor(Date.now() / 100) % 3];
          }

          blob.texture = characterFrames[characterFrame];

          if (kb.pressed.ArrowRight) {
            character.direction = 0;
            character.vx = Math.min(8, character.vx + 2);
          }
          if (kb.pressed.ArrowLeft) {
            character.direction = 1;
            character.vx = Math.max(-8, character.vx - 2);
          }
          if (kb.pressed.ArrowDown) {
            character.direction = 2;
            character.vy = Math.min(8, character.vy + 2);
          }
          if (kb.pressed.ArrowUp) {
            character.direction = 3;
            character.vy = Math.max(-8, character.vy - 2);
          }
        });
      }
    });
  }, []);

  // We have a dynamic component - no need to actually return anything
  return null;
};

export default Game;
