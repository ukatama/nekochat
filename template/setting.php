<md-dialog aria-label=Setting style="width: 500px;">
    <md-content>
        <container-input-container class="md-default-theme">
            <label><?= _('Name') ?></label>
            <input ng-model="form.name" layout-fill>
        </md-input-container>
        <md-input-container class="md-default-theme">
            <label><?= _('URL') ?></label>
            <input ng-model="form.character_url" ng-change=setCharacterName(form) layout-fill>
        </md-input-container>
        <label><?= _('Icon') ?></label>
        <md-radio-group ng-model="form.icon">
            <md-radio-button value="" aria-label="Default">
                <div layout=row layout-align="center center" layout-fill>
                    <div class=face style="background-image: url({{form.defaultIcon}});"></div>
                    <div style="width: 8px;"></div>
                    <div>Default</div>
                </div>
            </md-radio-button>
            <md-radio-button value="{{icon.id}}" aria-label="{{icon.name}}" ng-repeat="icon in icons">
                <div layout=row layout-align="center center" layout-fill>
                    <div class=face style="background-image: url({{icon.url}});"></div>
                    <div style="width: 8px;"></div>
                    <div>{{icon.name}}</div>
                </div>
            </md-radio-button>
        </md-radio-group>
        <md-input-container>
            <label style="transform: translate3d(0px, 4px, 0px);"><?= _('Upload Icon') ?></label>
            <div layout=row layout-align="center center">
                <input type=file id=upload-icon flex>
                <div>
                    <md-button ng-if=!uploading ng-click=upload()><?= _('Upload') ?></md-button>
                    <div ng-if=uploading>
                        <md-progress-circular md-mode="indeterminate"></md-progress-circular>
                    </div>
                </div>
            </div>
        </md-input-container>

    </md-content>
    <div class="md-actions" layout=row>
        <span flex></span>
        <md-button ng-click=close()><?= _('Close'); ?></md-button>
    </div>
</md-dialog>