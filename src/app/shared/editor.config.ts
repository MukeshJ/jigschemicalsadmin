import { AngularEditorConfig } from "@kolkov/angular-editor";

export const EditorConfig: AngularEditorConfig = {
    editable: true,
    // display sizing (the content area also has min-height in _angular-editor.scss)
    height: 'auto',
    minHeight: '250px',
    width: '100%',
    toolbarHiddenButtons: [
        [
            'insertImage',
            'insertVideo',
        ]
    ]
};