#include <QApplication>
#include <QWidget>
#include <QVBoxLayout>
#include <QLabel>
#include <QLineEdit>
#include <QPushButton>
#include <QString>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    QWidget window;
    window.setWindowTitle("My C++ App");
    window.resize(360, 240);

    auto *layout = new QVBoxLayout(&window);
    layout->setContentsMargins(24, 24, 24, 24);
    layout->setSpacing(14);

    auto *title = new QLabel("Welcome");
    auto *nameInput = new QLineEdit();
    auto *greetButton = new QPushButton("Say Hello");
    auto *messageLabel = new QLabel("Enter your name to begin.");

    title->setStyleSheet("font-size: 24px; font-weight: bold;");
    nameInput->setPlaceholderText("Your name");
    messageLabel->setWordWrap(true);

    layout->addWidget(title);
    layout->addWidget(nameInput);
    layout->addWidget(greetButton);
    layout->addWidget(messageLabel);
    layout->addStretch();

    QObject::connect(greetButton, &QPushButton::clicked, [nameInput, messageLabel]() {
        const QString name = nameInput->text().trimmed();

        if (name.isEmpty()) {
            messageLabel->setText("Please enter your name.");
            return;
        }

        messageLabel->setText("Hello, " + name + "!");
    });

    app.setStyleSheet(
            "QWidget { background-color: #121212; color: #eeeeee; }"
            "QLineEdit { background-color: #242424; border: 1px solid #505050; padding: 9px; border-radius: 5px; }"
            "QPushButton { background-color: #b71c1c; color: white; border: none; padding: 10px; border-radius: 5px; }"
            "QPushButton:hover { background-color: #aab71c1c; }"
    );

    window.show();
    return app.exec();
}
