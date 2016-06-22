import BaseStore from 'fluxible/addons/BaseStore';
import { events } from 'config/constants';

class ApplicationStore extends BaseStore {

    static storeName = 'ApplicationStore';

    static handlers = {
        [events.DO_STUFF]: 'onDoStuff',
        [events.BREAKPOINT_UPDATE]: 'onBreakpointUpdate',
        [events.UPDATE_WINDOW_SIZE]: 'onUpdateWindowSize',
    };

    constructor(dispatcher) {
        super(dispatcher);
        this.stuff = null;

        const breakpoint = {
            currentName: null,
            currentValue: null,
            previousName: null,
            previousValue: null,
            innerWidth: null,
        };

        this.state = {
            breakpoint,
            browser: null,
        };

        this.onBreakpointUpdate();
    }

    onDoStuff(stuff) {
        this.stuff = stuff;
        this.emitChange();
    }

    onBreakpointUpdate() {
        const prevBreakpoint = this.state.breakpoint;
        const getBreakpoints = this.getContext().getBreakpoints;
        if (
            (prevBreakpoint.currentName === null) ||
            (getBreakpoints.getActive() !== prevBreakpoint.currentName)
        ) {
            const currentName = getBreakpoints.getActive();
            const currentValue = getBreakpoints.getValue(currentName, true);
            const previousName = prevBreakpoint.currentName;
            const previousValue = prevBreakpoint.currentValue;

            this.state.breakpoint = {
                currentName,
                currentValue,
                previousName,
                previousValue,
            };

            this.emitChange();

            const current = parseInt(this.state.breakpoint.currentValue, 10);
            const previous = parseInt(this.state.breakpoint.previousValue, 10);

            if (this.state.breakpoint.previousValue === null) {
                return;
            }
        }
    }

    onUpdateWindowSize(dimensions) {
        this.state.winWidth = dimensions.width;
        this.state.winHeight = dimensions.height;
        this.emitChange();
    }

    getState() {
        return Object.assign({}, this.state);
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        Object.assign(this.state, state);
    }

}

export default ApplicationStore;
