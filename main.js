"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
// 기본 설정값
const DEFAULT_SETTINGS = {
    fontFamily: "D2Coding",
    fontSize: "90%",
};
class LaTeXFontPlugin extends obsidian_1.Plugin {
    constructor() {
        super(...arguments);
        this.settings = DEFAULT_SETTINGS;
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("LaTeX Text Font Changer loaded");
            // 설정 로드
            yield this.loadSettings();
            // 설정 탭 추가
            this.addSettingTab(new LaTeXFontSettingTab(this.app, this));
            // CSS 적용
            this.addStyle();
        });
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
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
            this.removeStyle();
            this.addStyle();
        });
    }
}
exports.default = LaTeXFontPlugin;
class LaTeXFontSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "LaTeX Text Font Changer Settings" });
        // 임시 변수 선언
        let tempFontFamily = this.plugin.settings.fontFamily;
        let tempFontSize = this.plugin.settings.fontSize;
        new obsidian_1.Setting(containerEl)
            .setName("Font Family")
            .setDesc("Set the font family for \\text{} elements.")
            .addText((text) => text
            .setPlaceholder("Enter font family")
            .setValue(tempFontFamily)
            .onChange((value) => {
            tempFontFamily = value;
        }));
        new obsidian_1.Setting(containerEl)
            .setName("Font Size")
            .setDesc("Set the font size for \\text{} elements.")
            .addText((text) => text
            .setPlaceholder("Enter font size (e.g., 90%)")
            .setValue(tempFontSize)
            .onChange((value) => {
            tempFontSize = value;
        }));
        // 적용 버튼 추가
        const applyButton = containerEl.createEl('button', { text: '적용' });
        applyButton.style.marginTop = '10px';
        applyButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.fontFamily = tempFontFamily;
            this.plugin.settings.fontSize = tempFontSize;
            yield this.plugin.saveSettings();
            new obsidian_1.Notice('LaTeX 폰트 설정이 적용되었습니다.');
        }));
    }
}
