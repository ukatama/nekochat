import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import TextField from 'material-ui/lib/text-field';
import React, { Component, PropTypes } from 'react';
import { makeColor } from '../utility/color';
import { MessageIcon } from '../containers/MessageIconContainer';

export const FROM_HEIGHT = 72;

export class MessageForm extends Component {
    static get propTypes() {
        return {
            character_url: PropTypes.string,
            disabled: PropTypes.bool,
            icon_id: PropTypes.string,
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]).isRequired,
            is_first: PropTypes.bool,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            }).isRequired,
            name: PropTypes.string,
            whisper_to: PropTypes.string,
            files: PropTypes.array,
            createMessage: PropTypes.func.isRequired,
            beginInput: PropTypes.func.isRequired,
            endInput: PropTypes.func.isRequired,
            createForm: PropTypes.func.isRequired,
            removeForm: PropTypes.func.isRequired,
            openDialog: PropTypes.func.isRequired,
            onAppendFile: PropTypes.func.isRequired,
        };
    }

    componentWillUpdate(nextProps) {
        const prev = this.props.whisper_to;
        const next = nextProps.whisper_to;
        if (!next || prev === next) return;

        const messageField = this.message;
        if (!messageField) return;
        if (!messageField.getValue().match(/^(@[^ ]+ ?)?$/)) return;

        this.message.setValue(`@${next} `);
    }

    parseMessage(text) {
        if (!text) return null;

        const lines = text.split(/\r\n|\n/);
        if (lines.length === 0) return null;

        const m = text && lines[0].match(/^(@([^\s]+)(\s|$))?((.|\n)*?)$/m);

        const message = m && ([m[4], ...lines.slice(1)].join('\n')) || null;
        if (!message) return null;

        const whisper_to = m[2] || null;

        return {
            message,
            whisper_to,
        };
    }

    onSubmit() {
        const messageField = this.message;
        const message = this.parseMessage(messageField.getValue());

        if (message) {
            const {
                id,
                name,
                character_url,
                files,
                icon_id,
            } = this.props;

            this.props.createMessage({
                form_id: id,
                name,
                character_url,
                icon_id,
                files,
                ...message,
            });

            messageField.setValue(
                message.whisper_to
                    ? `@${message.whisper_to} `
                    : ''
            );

            this.props.endInput();
        }
    }

    onKey(e) {
        const VK_RETURN = 13;

        if (e.keyCode === VK_RETURN && !e.shiftKey) {
            e.preventDefault();
            this.onSubmit(e);
        }
    }

    startInputWatcher() {
        if (this.inputWatcher) return;

        this.composition = false;
        this.prevMessage = '';
        this.inputWatcher = setInterval(() => this.watchInput(), 1000);
        this.watchInput();
    }

    stopInputWatcher() {
        this.watchInput();

        if (!this.inputWatcher) return;

        clearInterval(this.inputWatcher);
        this.inputWatcher = null;
    }

    watchInput() {
        if (this.composition || !this.message) return;

        const message = this.message.getValue();

        if (message !== this.prevMessage) {
            const {
                beginInput,
                endInput,
            } = this.props;

            if (message && message.charAt(0) !== '@') {
                beginInput({
                    name: this.props.name,
                    message,
                });
            } else {
                endInput();
            }
        }

        this.prevMessage = message;
    }

    render() {
        const {
            id,
            is_first,
            name,
            character_url,
            icon_id,
            user,
            disabled,
            files,
            createForm,
            removeForm,
            openDialog,
            onAppendFile,
        } = this.props;

        const Styles = {
            Form: {
                flex: '0 0 72px',
                display: 'flex',
                alignItems: 'center',
            },
            Icon: {
                flex: '0 0 60px',
                height: 60,
                margin: '0 8px',
                padding: 0,
            },
            Message: {
                flex: '1 1 auto',
            },
            File: {
                maxWidth: 60,
                maxHeight: 60,
            },
        };

        const fileElements = files && files.map((file, i) => (
            <img key={i} src={file.url} style={Styles.File} />
        ));

        return (
            <form style={Styles.Form} onSubmit={(e) => this.onSubmit(e)}>
                {is_first
                    ? <IconButton onTouchTap={() => createForm()}>
                        <FontIcon className="material-icons">
                            add
                        </FontIcon>
                    </IconButton>
                    : <IconButton onTouchTap={() => removeForm(id)}>
                        <FontIcon className="material-icons">
                            remove
                        </FontIcon>
                    </IconButton>
                }
                <IconButton
                    style={Styles.Icon}
                    onTouchTap={() => openDialog('message-config', id)}
                >
                    <MessageIcon
                        character_url={character_url}
                        color={makeColor(`${name}${user.id}`)}
                        id={icon_id}
                        name={name}
                    />
                </IconButton>
                {fileElements}
                <TextField fullWidth multiLine
                    disabled={disabled}
                    floatingLabelText={name}
                    name="message"
                    ref={(c) => c && (this.message = c)}
                    rows={1}
                    style={Styles.Message}
                    onBlur={() => this.stopInputWatcher()}
                    onCompositionEnd={() => (this.composition = false)}
                    onCompositionStart={() => (this.composition = true)}
                    onCompositionUpdate={() => (this.composition = true)}
                    onFocus={() => this.startInputWatcher()}
                    onKeyDown={(e) => this.onKey(e)}
                />
                <IconButton disabled={disabled} name="send" type="submit">
                    <FontIcon className="material-icons">send</FontIcon>
                </IconButton>
                <IconButton
                    disabled={disabled}
                    iconClassName="material-icons"
                    onTouchTap={() => this.file.click()}
                >
                    file_upload
                </IconButton>
                <input
                    accept="image/*"
                    ref={(c) => (this.file = c)}
                    style={{display: 'none'}}
                    type="file"
                    onChange={
                        (e) => e.target.files[0] &&
                            e.target.files[0].type.match(/^image\//) &&
                            onAppendFile(id, e.target.files[0])
                    }
                />
            </form>
        );
    }
}
