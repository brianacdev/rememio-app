export default defineAppConfig({
    ui: {
        colors: {
            primary: 'sky',
            secondary: 'gun-powder',
        },
        icons: {
            upload: 'i-material-symbols-upload-rounded',
        },
        card: {
            slots: {
                root: 'shadow-md',
                footer: 'flex justify-end gap-2',
            },
        },
        modal: {
            slots: {
                content: 'w-full lg:w-3xl lg:max-w-3xl',
                footer: 'flex justify-end gap-2',
            },
        },
    },
})
