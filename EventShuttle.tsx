type Listener = (eventName: string, payload: Payload) => void
type Payload = any

class EventListenerManager {
    private _listeners: Listener[] = [] 

    private findListenerIndex = (listener: Listener) => {
        return this._listeners.findIndex((item) => {
            return item === listener
        })
    }

    addListener = (listener: Listener) => {
        if(this.findListenerIndex(listener) === -1){
            this._listeners.push(listener)
        }
    }

    removeListener = (listener: Listener) => {
        const index = this.findListenerIndex(listener)
        if(index >=0) {
            this._listeners.splice(index)
        }
    }

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

    addEventListener = (eventName: string, listener: Listener) => {
        this.getEventListenerManager(eventName).addListener(listener)
    }

    removeEventListener = (eventName: string, listener: Listener) => {
        const event =  this._eventMap.get(eventName)
        if(!event) {
            throw Error(`Nothing to remove, Event: ${eventName} does not exist, add event with addEventListener method`)
        } else {
            event.removeListener(listener)
        }
    }

    dispatch = (eventName: string, payload?: Payload) => {
        let event = this._eventMap.get(eventName)
        if(!event) {
            throw Error(`Event: ${eventName} does not exist, add event with addEventListener method`)
        } else {
            event.dispatchEvent(eventName, payload)
        }
    }
}
export const eventShuttle = new EventShuttle()