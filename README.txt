KhataPro v8 - Notifications, Messages & Transaction Update

Included updates:
- Login page: Create Shop/Create Account option removed; existing-account login only.
- Owner -> Customer custom notifications.
- Owner <-> Customer real-time message box.
- Message notification sound and unread badges.
- Customer portal: Transactions first, then Notifications, then Messages.
- Automatic shop name shown in customer portal/notification context.
- PAYMENT DONE  and NEW PURCHASE notification titles.
- Transaction columns: Date & Time, Item, Original Price, Qty, Total.
- Original price shows the unit, e.g. NPR 200 / kg or NPR 50 / pcs.
- Quantity display preserves the entered unit (e.g. 500 gm stays 500 gm; no automatic display conversion).
- Total calculation still uses unit math: price per kg x grams/1000, price per pcs x pieces.
- Transaction row can be opened for a larger detail view in the customer portal.
- Logout confirmation remains enabled.

Firebase note:
- customerAccess message nodes allow customer-side message writes so the two-way chat can work without Firebase Authentication on the customer portal.
- Review Firebase Rules for your production security requirements.
