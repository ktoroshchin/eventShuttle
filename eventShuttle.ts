type Listener = (eventName: string, payload: Payload) => void
type Payload = any

class EventListenerManager {
    private _listeners: Listener[] = []
     
    private findListenerIndex = (listener: Listener) => {
        return this._listeners.findIndex((item) => {
            return item === listener
        })
    }

    /**
     * Method adds listener. Listener can not be an anonymous function
     * @param listener Function to be added
     */
    addListener = (listener: Listener) => {
        if(this.findListenerIndex(listener) === -1){
            this._listeners.push(listener)
        }
    }

    /**
     * Method removes listener
     * @param listener Function to be removed
     */
    removeListener = (listener: Listener) => {
        const index = this.findListenerIndex(listener)
        if(index >=0) {
            this._listeners.splice(index)
        }
    }

    /**
     * Method envokes event 
     * @param eventName Event name to be executed
     * @param payload Object, Array, primitive
     */
    dispatchEvent = (eventName: string, payload?: Payload) => {
        this._listeners.forEach(listener => {
            listener(eventName, payload)
        })
    }
}

class EventShuttle {
    private _eventMap = new Map<string, EventListenerManager>()

    private getEventListenerManager = (eventName: string): EventListenerManager => {
        // Get existing or create new event listener manager
        let listenerManager = this._eventMap.get(eventName)
        if(!listenerManager) {
            listenerManager = new EventListenerManager()
            this._eventMap.set(eventName, listenerManager)
        }
        return listenerManager
    }

    /**
     * Method adds event listener 
     * @param eventName Event name
     * @param listener Listener to be added
     */
    public addEventListener = (eventName: string, listener: Listener) => {
        this.getEventListenerManager(eventName).addListener(listener)
    }

    /**
     * Method removes event listener
     * @param eventName Event name
     * @param listener Listener to be removed
     */
    public removeEventListener = (eventName: string, listener: Listener) => {
        const event = this._eventMap.get(eventName)
        if(!event) {
            throw Error(`Nothing to remove, Event: ${eventName} does not exist, add event with addEventListener method`)
        } else {
            event.removeListener(listener)
        }
    }

    /**
     * Method envokes event
     * @param eventName Event name
     * @param payload Object, Array, primitive
     */
    public dispatch = (eventName: string, payload?: Payload) => {
        let event = this._eventMap.get(eventName)
        if(!event) {
            throw Error(`Event: ${eventName} does not exist, add event with addEventListener method`)
        } else {
            event.dispatchEvent(eventName, payload)
        }
    }
}

export const eventShuttle = new EventShuttle()