import {
  gfx3Manager,
  gfx3DebugRenderer,
  gfx3MeshRenderer,
  EnginePack3D,
  Gfx3CameraWASD,
  Screen,
  UT,
} from 'swgpu';
// ---------------------------------------------------------------------------------------

class GameScreen extends Screen {
  camera: Gfx3CameraWASD;
  pack: EnginePack3D;

  constructor() {
    super();
    this.camera = new Gfx3CameraWASD(0);
    this.pack = new EnginePack3D();
  }

  async onEnter() {
    this.camera.setPosition(0, 0, 10);
    this.pack = await EnginePack3D.createFromFile('./scene.blend.pak');

    const cameraPosition = localStorage.getItem('cameraPosition');
    if (cameraPosition) {
      const data = JSON.parse(cameraPosition);
      this.camera.setPosition(data[0], data[1], data[2]);
    }

    const cameraRotation = localStorage.getItem('cameraRotation');
    if (cameraRotation) {
      const data = JSON.parse(cameraRotation);
      this.camera.setRotation(data[0], data[1], data[2]);
    }
  }

  update(ts: number) {
    this.camera.update(ts);
    this.pack.jsm.forEach(item => item.object.update(ts));
    localStorage.setItem('cameraPosition', JSON.stringify(this.camera.getPosition()));
    localStorage.setItem('cameraRotation', JSON.stringify(this.camera.getRotation()));
  }

  draw() {
    this.pack.jsm.forEach(item => item.object.draw());
    gfx3MeshRenderer.setAmbientColor([0.5, 0.5, 0.5]);
    gfx3DebugRenderer.drawGrid(UT.MAT4_ROTATE_X(Math.PI * 0.5), 20, 1);
  }

  render(ts: number) {
    gfx3Manager.beginRender();
    gfx3Manager.beginPassRender(0);
    gfx3DebugRenderer.render();
    gfx3MeshRenderer.render(ts);
    gfx3Manager.endPassRender();
    gfx3Manager.endRender();
  }
}

export { GameScreen };