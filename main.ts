import { App, Plugin, PluginSettingTab, Setting, Notice } from "obsidian";

// 플러그인 설정 타입 정의
interface LaTeXFontSettings {
  fontFamily: string;
  fontSize: string;
}

// 기본 설정값
const DEFAULT_SETTINGS: LaTeXFontSettings = {
  fontFamily: "D2Coding",
  fontSize: "90%",
};

export default class LaTeXFontPlugin extends Plugin {
  settings: LaTeXFontSettings = DEFAULT_SETTINGS;

  async onload() {
    console.log("LaTeX Text Font Changer loaded");

    // 설정 로드
    await this.loadSettings();

    // 설정 탭 추가
    this.addSettingTab(new LaTeXFontSettingTab(this.app, this));

    // CSS 적용
    this.addStyle();
  }

  onunload() {
    console.log("LaTeX Text Font Changer unloaded");
    this.removeStyle();
  }

  addStyle() {
    const style = document.createElement("style");
    style.id = "latex-text-font-style";
    style.innerText = `
      mjx-utext {
        font-family: "${this.settings.fontFamily}" !important;
        font-size: ${this.settings.fontSize};
      }
    `;
    document.head.appendChild(style);
  }

  removeStyle() {
    const style = document.getElementById("latex-text-font-style");
    if (style) {
      style.remove();
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.removeStyle();
    this.addStyle();
  }
}

class LaTeXFontSettingTab extends PluginSettingTab {
  plugin: LaTeXFontPlugin;

  constructor(app: App, plugin: LaTeXFontPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "LaTeX Text Font Changer Settings" });

    // 임시 변수 선언
    let tempFontFamily = this.plugin.settings.fontFamily;
    let tempFontSize = this.plugin.settings.fontSize;

    new Setting(containerEl)
      .setName("Font Family")
      .setDesc("Set the font family for \\text{} elements.")
      .addText((text) =>
        text
          .setPlaceholder("Enter font family")
          .setValue(tempFontFamily)
          .onChange((value) => {
            tempFontFamily = value;
          })
      );

    new Setting(containerEl)
      .setName("Font Size")
      .setDesc("Set the font size for \\text{} elements.")
      .addText((text) =>
        text
          .setPlaceholder("Enter font size (e.g., 90%)")
          .setValue(tempFontSize)
          .onChange((value) => {
            tempFontSize = value;
          })
      );

    // 적용 버튼 추가
    const applyButton = containerEl.createEl('button', { text: '적용' });
    applyButton.style.marginTop = '10px';
    applyButton.addEventListener('click', async () => {
      this.plugin.settings.fontFamily = tempFontFamily;
      this.plugin.settings.fontSize = tempFontSize;
      await this.plugin.saveSettings();
      new Notice('LaTeX 폰트 설정이 적용되었습니다.');
    });
  }
}
