public class NoteFormatter {
    public static void main(String[] args) {
        if (args.length > 0) {
            String input = args[0];
            String formatted = "[Note] " + input.toUpperCase();
            System.out.println(formatted);
        } else {
            System.out.println("No input provided");
        }
    }
}
