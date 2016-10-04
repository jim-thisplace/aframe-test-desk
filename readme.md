# aframe-test-desk

Recreate my This Place office desktop scene in Aframe

## Getting started

```
npm i ; grunt
```

## Learnings

- Models with faces that have more than 3 vertices will not load in THREE.js loaders (which is what AFrame is using)
- Ctrl + Alt + I opens the AFrame Inspector which you can use to rearrange entities in the scene. You can
copy the resultant HTML

- Youtube Videos need to be downloaded as MP4 or [proxied to be viewable as textures](http://stackoverflow.com/questions/36298195/how-to-render-youtube-videos-as-a-texture-in-a-frame)
- [`<script/>` after `</body>` produces undefined behavior and should be avoided.](http://stackoverflow.com/q/3037725/4921124)
- aframe-cubemap-component order diagram:

```
   px   py
     \  |
      \ |
       \|
 pz-----*----> nz
        |\
        | \
        |  \
        ny  nx


  -->   indicates direction of camera relative to the inside faces of
        the cubemap
```

## Blender Recap

- [Blender HotKeys](https://wiki.blender.org/index.php/Doc:2.4/Reference/Hotkeys/Edit)
- After selection (A to select all), TAB enters Edit mode.
- [Rotate texture](http://blender.stackexchange.com/questions/5608/rotate-object-texture)