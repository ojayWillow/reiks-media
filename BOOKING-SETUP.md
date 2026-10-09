# Appointment requests

The Media page uses a compact Latvian form. It requests a preferred weekday and
30-minute time in Europe/Riga. These are requests, not confirmed appointments;
there is no claim of live calendar availability. The owner confirms by email.

The published form currently uses `data-delivery="email"`: it opens the visitor's
email application with a prepared request to vitolsoskars@gmail.com. The visitor
must send that email. The UI does not claim it has been delivered or booked.

The prepared `api/booking.js` sends one plain-text notification via Resend, with the visitor's
email as Reply-To. The recipient and sender are configured on the server only.
It never reports success if sending is unconfigured or the provider fails.

Before enabling delivery on Vercel, configure:

- `RESEND_API_KEY`: a sending key stored privately in Vercel environment variables.
- `BOOKING_FROM`: a sender approved for the Resend account/domain.
- `BOOKING_TO`: the destination inbox; the user selected vitolsoskars@gmail.com for the example.

After configuring and verifying delivery, change the form's `data-delivery` to
`direct`, change the submit label back to `Pieteikt sarunu`, and remove the note
about opening the email application.

Do not put credentials into HTML or commit them. No provider account, credentials,
verified sender, or deployment was created as part of the local form preview.

Local Python preview serves the form design only; it cannot execute Vercel functions.
Validation and send/failure handling were checked with a mocked provider, without
sending an email. Delivery needs a verified end-to-end check after configuration.

Provider reference: https://resend.com/docs/api-reference/emails/send-email
