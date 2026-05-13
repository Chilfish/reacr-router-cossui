import { Example, ExampleWrapper } from '~/components/example'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'

function Particle() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive-outline" />}>
        删除账号
      </AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>
          <AlertDialogClose render={<Button variant="destructive" />}>
            Delete Account
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}

export function App() {
  return (
    <ExampleWrapper>
      <Example title="Test">
        <Particle />
      </Example>
    </ExampleWrapper>
  )
}

export default App
