import {
    Plugin,
    IModel,
    Protyle,
} from "siyuan";
import "@/index.scss";
import {putFile} from "@/api";
import {inputDialogSync} from "@/libs/dialog";


const STORAGE_NAME = "menu-config";

export default class PluginSample extends Plugin {

    customTab: () => IModel;

    async onload() {
        this.data[STORAGE_NAME] = {readonlyText: "Readonly"};

        console.log("loading plugin-sample", this.i18n);
        const that = this;


        this.protyleSlash = [
            {
                filter: ["drawio", "new"],
                html: this.getMenuItem(this.i18n.createDrawio),
                id: "createFileDrawio",
                async callback(protyle: Protyle) {
                    that.createFile(protyle, '<mxfile><diagram></diagram></mxfile>', 'drawio')
                }
            },
            {
                filter: ["excalidraw", "new"],
                html: this.getMenuItem(this.i18n.createExcalidraw),
                id: "createFileExcalidraw",
                async callback(protyle: Protyle) {
                    that.createFile(protyle, '{"type": "excalidraw"}', 'excalidraw')
                }
            },
            {
                filter: ["emptyfile", "new"],
                html: this.getMenuItem(this.i18n.createEmptyFile),
                id: "createEmptyFile",
                async callback(protyle: Protyle) {
                    that.createFile(protyle, '', '')
                }
            }
        ];
    }

    private getMenuItem(text: string){
        return `<div class="b3-list-item__first"><span class="b3-list-item__text">${text}</span><span class="b3-list-item__meta">create-file-plugin</span></div>`
    }

    private async createFile(protyle: Protyle, template: string, ext: string) {
        let name = await inputDialogSync({
            title: `新建文件 (${ext ? '.' + ext : '其他'})`,
            placeholder: `请输入文件名，${ext ? '无需扩展名' : '包含扩展名'}`
        });
        if (name.length < 1) {
            return;
        }
        if (ext == '') {
            let dot_pos = name.lastIndexOf('.')
            if (dot_pos == -1) {
                console.log('没有获取到扩展名', name);
                return;
            }
            ext = name.substring(dot_pos + 1)
            name = name.substring(0, dot_pos)
        }

        const salt = Math.random().toString(36).substring(8);
        let filename = name + '-' + salt + '.' + ext;

        const file = new File([template], 'file');
        putFile('/data/assets/' + filename, false, file)

        protyle.insert(`[${name}.${ext}](assets/${filename})`, true, true);
    }
}
