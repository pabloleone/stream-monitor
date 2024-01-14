Define and implement NoSQL data structure and justify how you would normalize it so that messages/comments from other 
platforms (Facebook, Instagram, YouTube) could be added to the same data store (10 min)

```ts
type Twitter = {
    name: 'twitter';
    // platform specific fields
}
type Platform = Twitter | Facebook | ...;
type Stream = {
    content: string;
    platform: Platform;
    timestamp: Date;
}
```

`platform` would be a discriminated union containing platform specific fields.

---

Implement the service(s) for monitoring the tweets in real-time (1 hour)

The service is implemented as a deamon.

Execute the nest project using `docker compose up --build` (read the README.md within NestJs project) and in another terminal execute the streamer daemon using `node streamSimulator.js` (install deps first)

---

Implement the anomaly detection system, describe how it works and what would be the business
advantages of having such a system (1,5 hours)

The streams are stored and moved to archive table when necessary.
A parallel system is monitoring the DB looking for anomalies using the z-score method in a time shifting window.
When an anomaly is detected all defined alerts are triggered. Only one has been defined, but the system allows to define many.
Same as with alerts, the system allows to defined and run many anomaly detection methods.

The anomaly detection system helps identify unusual spikes or drops in activity, enabling proactive responses.
Businesses can use this information for marketing strategies, crisis management, or monitoring the impact of campaigns.

---

Select a single functionality of your app and write a test for it (1 hour)

I face a critial error while trying to create the tests. I couldn't solve in a reasonable amount of time the issue so I decided to do the test, even though I'm not happy with the approach. The error is when trying to spyOn a Model, for some reason the method spyied type is inferred as never, when it isn't the case.