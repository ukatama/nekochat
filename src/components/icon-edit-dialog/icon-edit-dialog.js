import _ from 'lodash';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import React, {Component, PropTypes} from 'react';
import {IconListItem} from './icon-list-item';

export class IconEditDialog extends Component {
    static get propTypes() {
        return {
            iconList: PropTypes.array.isRequired,
            open: PropTypes.bool.isRequired,
            onClose: PropTypes.func.isRequired,
            onRemove: PropTypes.func.isRequired,
            onRemoveSelected: PropTypes.func.isRequired,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            selections: {},
        };
    }

    render() {
        const {
            iconList,
            open,
            onRemove,
            onRemoveSelected,
            onClose,
        } = this.props;
        const {
            selections,
        } = this.state;

        const actions = [
            <FlatButton
                primary
                key="close"
                label="Close"
                onTouchTap={onClose}
            />,
        ];

        const iconListItemElements = iconList.map(
            (icon) => (
                <IconListItem
                    {...icon}
                    key={icon.id}
                    selected={Boolean(selections[icon.id])}
                    onRemove={() => onRemove(icon)}
                    onSelect={
                        (e, v) => this.setState({
                            selections: {
                                ...selections,
                                [icon.id]: v,
                            },
                        })
                    }
                />
            )
        );

        const style = {
            body: {
                display: 'flex',
                flexDirection: 'column',
            },
            list: {
                flex: '1 1 auto',
                overflowY: 'scroll',
                WebkitOverflowScrolling: 'touch',
            },
        };

        return (
            <Dialog
                actions={actions}
                bodyStyle={style.body}
                open={open}
                title="Icons"
                onRequestClose={onClose}
            >
                <div>
                    <IconButton
                        disabled={!_(selections).values().some()}
                        iconClassName="material-icons"
                        onTouchTap={
                            (e) => onRemoveSelected(
                                e,
                                iconList.filter(({id}) => selections[id])
                            )
                        }
                    >
                        delete
                    </IconButton>
                </div>
                <div style={style.list}>
                    <ul>{iconListItemElements}</ul>
                </div>
            </Dialog>
        );
    }
}
