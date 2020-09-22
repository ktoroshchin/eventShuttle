# eventShuttle
The EventShuttle service is a subscribe event manager which allows de-coupling of event source and handler.

## Implementation
The EventShuttle is a singleton, so any file in any on-page app which imports the EventBus will receive the same instance. This allows for events to be raised on one app and handled in another.

import eventShuttle from 'eventShuttle.ts';

## Adding Listeners
The EventShuttle attaches one or more listeners to a single event by using a unique event key (string) per event. There is no limit to how many listeners can be attached to a single event key. Event listeners are called in the order they are added.

eventShuttle.addListener('unique.event.key', myEventHandlerFunction)
Tip: It is recommended to export your event keys as constants from a shared file.

## Removing Listeners & Cleaning Up
To avoid memory leaks, event listeners must be removed when they are no longer needed. The same key and function which were provided to addEventListener must be provided to removeEventListener.

eventShuttle.removeEventListener('unique.event.key', myEventHandlerFunction)

Removing Listeners

Both the key and the event must be exactly the same as the ones provided to the addEventListener function. In JavaScript strings are objects; it's not needed to pass the same string object - only the values of the strings need to match. The listener function must be a reference to exactly the same function. This means you cannot use an anonymous function in your addEventListener call.

## Dispatching Events
Sending an event through the eventShuttle is done with the dispatch function.

eventShuttle.dispatch('unique.event.key' [, payload])
Any object, array or primitive can be sent along with the event via the optional payload parameter. 
The payload will be the second parameter provided to the event listeners.

## React use case
```
const handleMode = (eventName: string, payload: { mode: string }) => {
    setState({
        uiMode: mode
    })
}

React.useEffect(() => {
    eventShuttle.addEventListener('ToolbarMode', handleMode)
    //When component unmounts you must remove event listener.
    //If component will rerender 10 times it will execute handleMode 10 times when its called. 
    return () => {
        eventShuttle.removeEventListener('ToolbarMode', handleMode)
    }
})

<button onClick={() => eventShuttle.dispatch('ToolbarMode', { mode: data.value })}>Click ME!<button/>
```
