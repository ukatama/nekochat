describe('RoomActions', () => {
    jest.dontMock('../RoomActions');
    const ACTIONS = require('../../constants/RoomActions');
    const Actions = require('../RoomActions');

    it('should be return type', () => {
        [
            ['join', 'JOIN', 'id'],
            ['joined', 'JOINED', {}],
            ['password', 'PASSWORD', {}],
            ['leave', 'LEAVE'],
            ['left', 'LEFT'],
            ['create', 'CREATE', {}],
            ['update', 'UPDATE', {}],
            ['remove', 'REMOVE', {}],
            ['list', 'LIST', []],
            ['fetch', 'FETCH'],
            ['userJoined', 'USER_JOINED', {}],
            ['userLeft', 'USER_LEFT', {}],
            ['fetchUser', 'FETCH_USER'],
            ['userList', 'USER_LIST', []],
        ].forEach(([akey, ckey, ...args]) => {
            expect(Actions[akey](...args).type)
                .toEqual(ACTIONS[ckey]);
        });
    });
});
