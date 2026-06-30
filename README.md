# nhis-connect

A mobile app that makes NHIS membership renewal and appointment booking simple for subscribers in Ghana.

## About

This project is the practical implementation accompanying the final year project *"Making Health Insurance More Responsive Through Mobile Renewal — Design and Development of an NHIS Mobile Application in Ghana"*, submitted to the Department of Computer Science, Koforidua Technical University (affiliated to Valley View University).

The current National Health Insurance Scheme (NHIS) renewal process in Ghana is fragmented across an in-person office process, a USSD platform (*929#), and the MyNHIS app — none of which offers appointment booking, renewal-deadline reminders, or a complete digital membership card. **nhis-connect** consolidates renewal submission, status tracking, digital card access, appointment booking, and push/SMS reminders into a single mobile application, with both subscriber and administrator roles served from the same app.

This is an academic prototype intended for a working demonstration, not a production deployment. The renewal workflow is simulated (receipt upload, no live payment gateway integration), and the accredited facility list is manually seeded rather than pulled from a live NHIA data feed.

## Status

🚧 In development — scaffolded from a starter template, feature implementation has not yet started.

## Tech Stack

- **Frontend:** React Native (Expo, managed workflow), Expo Router (file-based navigation)
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Language:** TypeScript
- **State management:** Zustand
- **Form validation:** Zod + react-hook-form
- **Notifications:** Expo Push Notifications, Africa's Talking SMS API (to be integrated)
- **Build:** Expo EAS Build

## Roles

- **Subscriber** — register/login, submit renewal requests, track status, view digital membership card, browse accredited facilities, book appointments, receive notifications.
- **Administrator** — review and approve/reject renewal requests, manage accredited facility records, view appointment records, configure reminder rules. Administrator accounts are seeded manually in Supabase; there is no public sign-up path to the admin role.

## Setup

1. **Clone the project** and go into the folder:
   ```
   git clone <repository-url>
   cd nhis-connect
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables.** Create a `.env` file with your Supabase project credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Check and fix the Expo environment** (recommended):
   ```
   npx expo-doctor
   ```
   Or to validate and align package versions with the Expo SDK:
   ```
   npx expo install --check
   ```

5. **Start the app**:
   ```
   npx expo start
   ```
   Then open in iOS simulator, Android emulator, or scan the QR code with the Expo Go app.

## Project Structure

```
nhis-connect/
├── app/                  # Expo Router screens (file-based navigation)
│   ├── (dash)/(tabs)/    # Tab layout
│   ├── _layout.tsx       # Root layout, font loading
│   └── index.tsx
├── components/
│   ├── common/           # MainContainer, Text
│   ├── shared/           # Toast
│   └── ui/               # Button, TextField, Picker, OtpInput, ImagePicker, DocPicker, Steps, BottomSheet, Link
├── constants/
│   ├── colors.ts         # Light/dark palettes
│   ├── fonts.ts          # Poppins fonts
│   └── typography.ts     # FontSizes, FontWeights, LineHeights
├── contexts/             # ThemeContext (light/dark)
├── lib/
│   └── validation.ts     # Zod schemas
├── config/
│   └── supabase.ts       # Supabase client setup
├── store/                # Zustand
└── assets/fonts/         # Poppins font files
```

## Documentation

Full project documentation (proposal, literature review, system analysis, and detailed design — including all process, data, and UML diagrams) is maintained separately as part of the academic submission.

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Scaffolded from [starter-template-expo](https://github.com/Sonnysam/starter-template-expo) by Sonnysam.*
