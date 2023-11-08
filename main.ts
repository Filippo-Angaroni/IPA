import { View, App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Workspace, setIcon, addIcon } from 'obsidian';
import { Decoration, EditorView, WidgetType} from "@codemirror/view";
import { normalize } from 'path';
// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

var ipachars: string[];

ipachars = [ "ɑ", "æ", "ɐ", "ɑ̃", "β", "ɓ", "ʙ", "ç", "ɕ", "ð", "d͡ʒ", "ɖ", "ɗ", "ə", "ɚ", "ɵ", "ɘ", "ɛ", "ɜ", "ɝ", "ɛ̃", "ɞ", "ɠ", "ɢ", "ʛ", "ɡ", "ħ", "ɦ", "ɥ", "ɧ", "ʜ", "ɪ", "ɨ", "ɪ̈", "ʝ", "ɟ", "ʄ", "ɫ", "ɭ", "ɬ", "ʟ", "ɮ", "ɱ", "ŋ", "ɲ", "ɳ", "ɴ", "ɔ", "œ", "ɒ", "ɔ̃", "ɶ", "ø", "ɸ", "ɾ", "ɹ", "ʁ", "ʀ", "ɻ", "ɽ", "ɺ", "ʃ", "ʂ", "θ", "t͡ʃ", "t͡s", "ʈ", "ʊ", "ʉ", "ʌ", "ʋ", "ⱱ", "ɯ", "ʍ", "ɰ", "χ", "ɣ", "ʎ", "ʏ", "ɤ", "ʒ", "ʐ", "ʑ", "ʔ", "ʕ", "ʡ", "ʢ", "ː" ]

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	
	

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SampleSettingTab(this.app, this));

		const statusbaritem = this.addStatusBarItem();
		statusbaritem.onclick = (event) => {
			if (this.checkMenuExistance() == true){
				this.removeMenu();
				setIcon(statusbaritem, "chevron-up-square");
			} else {
				this.createMenu();
				setIcon(statusbaritem, "chevron-down-square");
			}
		}

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			let checkExist = false;
			this.app.workspace.containerEl.childNodes.forEach(element => {
				if (String((element as HTMLElement).id) == "UniverseMainDiv")
				{
					checkExist = true;
					this.app.workspace.containerEl.removeChild(element);
					setIcon(statusbaritem, "chevron-up-square")
				}
			});
			if (checkExist == false){ 
				this.createMenu();
				setIcon(statusbaritem, "chevron-down-square");
			}
		});

		
		
	}

	checkMenuExistance(): boolean {
		let checkExist = false;
		this.app.workspace.containerEl.childNodes.forEach(element => {
			if (String((element as HTMLElement).id) == "UniverseMainDiv")
			{
				checkExist = true;
			}
		});
		return checkExist;
		

	}

	removeMenu() {
		this.app.workspace.containerEl.childNodes.forEach(element => {
			if (String((element as HTMLElement).id) == "UniverseMainDiv"){
				this.app.workspace.containerEl.removeChild(element);
			}
		});
	}

	createMenu() {

		//MAIN MENU STRUCTURE
		const cl = this.app.workspace.containerEl;
		const mainmenu = cl.createEl("div", {cls: "main-div"});
		mainmenu.id = "UniverseMainDiv";
  
		//SUB MAINMENU
		const submainmenu = mainmenu.createEl("div", {cls: "sub-main-div"});

		//SEARCER
		const searcher = submainmenu.createEl("input", {cls: "searcher"});
		searcher.type = "search";

		//COLLECTION TAB
		const collectiontab = submainmenu.createEl("div", {cls: "collection-tab"});
		
		const collectionheader = collectiontab.createEl("div", {cls: "collection-tab-item"});
		const collectionheadericon = collectionheader.createEl("i", {cls: "collection-header-icon"});
		setIcon(collectionheadericon, "chevron-down");
		
		collectionheadericon.onclick = (event) => {
			if (preferedcollection.style.display == "none"){
				preferedcollection.style.display = "block";
				setIcon(collectionheadericon, "chevron-up");
			} else {
				preferedcollection.style.display = "none";
				setIcon(collectionheadericon, "chevron-down");
			}
		}

		const preferedcollection = submainmenu.createEl("div", {cls: "char-tab"});
		preferedcollection.style.display = "none";
		const preferedcollectiongrid = preferedcollection.createEl("div", {cls: "char-grid"});
		preferedcollection.style.height = "50%";
		this.settings.mySetting.split(";").forEach(element => {
			const chardiv = preferedcollectiongrid.createEl("div", {cls: "char-div"});
			chardiv.onclick = (evenet) => {this.addChar(element);};
			const char = chardiv.createEl("span", {text: element});
		});
		

		//CHARACTERS TAB
		const chartab = submainmenu.createEl("div", {cls: "char-tab"}); 

		const chargrid = chartab.createEl("div", {cls: "char-grid"});
		
		
		for (let i = 0; i < ipachars.length; i++){
			const chardiv = chargrid.createEl("div", {cls: "char-div"});
			chardiv.onclick = (evenet) => {this.addChar(ipachars[i]);};
			const char = chardiv.createEl("span", {text: ipachars[i]});
		}
	}

	addChar(ipachar: string){
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view){
			const cursor =	view.editor.getCursor();
			view.editor.replaceRange(ipachar, view.editor.getCursor());
			view.editor.setCursor(cursor.line, cursor.ch+1);
		}
	}

	createPreferedMenu() {

	}

	onunload() {	
		this.removeMenu();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		const tre = createEl("div", {text: "ciao", cls: "setting-main"});
		new Setting(containerEl)
			.setName('Favorites Characters')
			.setDesc("Insert your favorite characters separated by ;")
			.addText(text => text
				.setPlaceholder('a;b;c;d')
				
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
			
	}
}
