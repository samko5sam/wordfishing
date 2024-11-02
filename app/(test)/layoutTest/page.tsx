import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const messages = [
    {
      content:
        "Certainly! Here's a long lorem ipsum text for you: --- Lorem ipsum\ndolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio\nvitae vestibulum vestibulum. Cras vehicula, turpis vitae euismod\nullamcorper, purus sapien volutpat orci, eu porta quam erat nec\nenim. Nullam in consequat sem, sed posuere tortor. Mauris posuere,\ntellus a suscipit scelerisque, felis odio pretium nisl, sit amet\nullamcorper lorem libero ut arcu. Vestibulum eget volutpat felis,\nquis tempor erat. Fusce ac urna quam. Proin luctus, felis a\ndignissim cursus, arcu ante lacinia magna, non bibendum augue urna\nsit amet ligula. Quisque blandit, nisl eu tincidunt fermentum, velit\nleo dignissim ex, quis aliquet ligula lectus quis justo. Integer\nscelerisque, magna sed convallis facilisis, orci dolor semper\nlibero, a tincidunt leo orci eu arcu. Curabitur vehicula justo vitae\ntortor varius, a facilisis nunc varius. Curabitur fringilla turpis\nvel turpis ullamcorper, quis cursus magna scelerisque. Maecenas at\nodio sit amet velit facilisis pharetra non id massa. Fusce non risus\nquam. Morbi vehicula, ipsum vitae cursus varius, sem arcu sagittis\ntortor, ac tincidunt libero orci in justo. Vivamus ultricies magna a\nnulla sollicitudin, in suscipit eros consequat. Nam pulvinar, enim\neget fermentum aliquet, metus massa pharetra orci, vel volutpat enim\ntellus et nulla. Cras pharetra, ligula sit amet sagittis vulputate,\npurus ipsum vehicula velit, a venenatis lectus justo at orci. Sed\npretium turpis mi, vitae interdum enim euismod in. Nulla congue,\nvelit at fringilla vulputate, magna urna lobortis tortor, vitae\nullamcorper arcu arcu ut urna. Phasellus vel augue vel augue commodo\nmalesuada. Donec dictum facilisis felis vel facilisis. Ut tempor,\nodio sed tincidunt rutrum, est massa tincidunt purus, at vehicula\nligula ipsum id justo. Aliquam imperdiet vel purus in euismod.\nVivamus quis laoreet ipsum, quis iaculis enim. Praesent volutpat\norci at dapibus molestie. Donec vitae quam sit amet orci pharetra\nlaoreet a in erat. Etiam suscipit odio at urna mattis, id viverra\nnisi fermentum. Pellentesque tristique posuere velit et tincidunt.\nMorbi venenatis ligula neque, in tincidunt elit fringilla ac. Morbi\nac tincidunt libero. Ut ac ligula eu diam dapibus elementum. Mauris\ncursus ligula sit amet commodo pretium. Curabitur sit amet massa\nvenenatis, condimentum enim eget, vestibulum massa. Aliquam erat\nvolutpat. Quisque gravida augue sit amet accumsan aliquet.\nSuspendisse potenti. Curabitur bibendum vestibulum mauris, vel\npharetra mi porttitor vitae. Nulla quis neque a lacus vehicula\ntempor sit amet in massa. Sed nec dui ut lectus pellentesque\ncondimentum. Nunc pulvinar leo nec dui cursus, non dapibus justo\nlacinia. Aenean luctus nisi hendrerit, tristique quam in, efficitur\ndolor. Sed consequat, felis ut malesuada ultricies, arcu erat\nvehicula leo, in gravida mi lacus a eros. Nam quis volutpat libero,\net finibus ex. Phasellus congue metus ut euismod auctor. Integer\neuis...",
      role: "assistant",
    },
  ];
  return (
    <div className="h-screen flex flex-col">
      <div className="min-h-[48px]"></div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="container mx-auto p-4 flex-1 flex flex-col max-w-4xl h-full">
          <h1 className="text-2xl font-bold">AI 學習助手</h1>
          <div className={`transition-all duration-300 mb-4`}>
            <div className="fixed top-28 left-4 right-4 z-10">
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Certainly! Here's a long lorem ipsum text for you: --- Lorem ipsum\ndolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio\nvitae vestibulum vestibulum. Cras vehicula, turpis vitae euismod\nullamcorper, purus sapien volutpat orci, eu porta quam erat nec\nenim. Nullam in consequat sem, sed posuere tortor. Mauris posuere,\ntellus a suscipit scelerisque, felis odio pretium nisl, sit amet\nullamcorper lorem libero ut arcu. Vestibulum eget volutpat felis,\nquis tempor erat. Fusce ac urna quam. Proin luctus, felis a\ndignissim cursus, arcu ante lacinia magna, non bibendum augue urna\nsit amet ligula. Quisque blandit, nisl eu tincidunt fermentum, velit\nleo dignissim ex, quis aliquet ligula lectus quis justo. Integer\nscelerisque, magna sed convallis facilisis, orci dolor semper\nlibero, a tincidunt leo orci eu arcu. Curabitur vehicula justo vitae\ntortor varius, a facilisis nunc varius. Curabitur fringilla turpis\nvel turpis ullamcorper, quis cursus magna scelerisque. Maecenas at\nodio sit amet velit facilisis pharetra non id massa. Fusce non risus\nquam. Morbi vehicula, ipsum vitae cursus varius, sem arcu sagittis\ntortor, ac tincidunt libero orci in justo. Vivamus ultricies magna a\nnulla sollicitudin, in suscipit eros consequat. Nam pulvinar, enim\neget fermentum aliquet, metus massa pharetra orci, vel volutpat enim\ntellus et nulla. Cras pharetra, ligula sit amet sagittis vulputate,\npurus ipsum vehicula velit, a venenatis lectus justo at orci. Sed\npretium turpis mi, vitae interdum enim euismod in. Nulla congue,\nvelit at fringilla vulputate, magna urna lobortis tortor, vitae\nullamcorper arcu arcu ut urna. Phasellus vel augue vel augue commodo\nmalesuada. Donec dictum facilisis felis vel facilisis. Ut tempor,\nodio sed tincidunt rutrum, est massa tincidunt purus, at vehicula\nligula ipsum id justo. Aliquam imperdiet vel purus in euismod.\nVivamus quis laoreet ipsum, quis iaculis enim. Praesent volutpat\norci at dapibus molestie. Donec vitae quam sit amet orci pharetra\nlaoreet a in erat. Etiam suscipit odio at urna mattis, id viverra\nnisi fermentum. Pellentesque tristique posuere velit et tincidunt.\nMorbi venenatis ligula neque, in tincidunt elit fringilla ac. Morbi\nac tincidunt libero. Ut ac ligula eu diam dapibus elementum. Mauris\ncursus ligula sit amet commodo pretium. Curabitur sit amet massa\nvenenatis, condimentum enim eget, vestibulum massa. Aliquam erat\nvolutpat. Quisque gravida augue sit amet accumsan aliquet.\nSuspendisse potenti. Curabitur bibendum vestibulum mauris, vel\npharetra mi porttitor vitae. Nulla quis neque a lacus vehicula\ntempor sit amet in massa. Sed nec dui ut lectus pellentesque\ncondimentum. Nunc pulvinar leo nec dui cursus, non dapibus justo\nlacinia. Aenean luctus nisi hendrerit, tristique quam in, efficitur\ndolor. Sed consequat, felis ut malesuada ultricies, arcu erat\nvehicula leo, in gravida mi lacus a eros. Nam quis volutpat libero,\net finibus ex. Phasellus congue metus ut euismod auctor. Integer\neuis... */}
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-blue-100 dark:bg-blue-900 ml-12"
                      : "bg-gray-100 dark:bg-gray-700 mr-12"
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Textarea/>
            <Button>
              {"傳送"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
