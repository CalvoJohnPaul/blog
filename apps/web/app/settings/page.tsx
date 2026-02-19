import {SettingsForm} from './SettingsForm';
import {SignOut} from './SignOut';

export default function Page() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-center text-4xl">Your Settings</h1>
      <SettingsForm />
      <div className="mt-5 border-t border-gray-200 pt-5">
        <SignOut />
      </div>
    </div>
  );
}
