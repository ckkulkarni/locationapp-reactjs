Feature: Displaying Location on Map

    Scenario: Viewing Location on the Map
        Given the user is on the Map page
        Then the user should see the address of the location that will be displayed in the map
        And the user should see a marker indicating the specified location
        And the user should see the map rendered correclty

