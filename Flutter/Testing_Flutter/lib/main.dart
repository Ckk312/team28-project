import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:email_validator/email_validator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        scaffoldBackgroundColor: Colors.black,
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.tealAccent,
            foregroundColor: Colors.black,
          ),
        ),
      ),
      home: const LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  LoginPageState createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _userLoginController = TextEditingController();
  final TextEditingController _passwordLoginController = TextEditingController();
  final loginApiURL = "http://www.ckk312.xyz:5000/api/login";

  void loginUser() async {
    if (_userLoginController.text.isEmpty || _passwordLoginController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Username and password cannot be empty'),
            backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    var reqBody = {
      "username": _userLoginController.text,
      "password": _passwordLoginController.text
    };

    try {
      final response = await http.post(
        Uri.parse(loginApiURL),
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonEncode(reqBody),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        if (responseData['error'] == "") {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const TitlePage()),
          );
        }
        else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content: Text('Login failed: Incorrect username or password'),
                backgroundColor: Colors.redAccent,
            ),
          );
        }
      }
      else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Server error: ${response.statusCode}'),
              backgroundColor: Colors.redAccent,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('Network error: $e'),
            backgroundColor: Colors.redAccent,
        )
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Center(
          child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Align the image to move it higher
                Image.asset(
                  'assets/Esports-Logo.png',
                  width: 250,
                  height: 250,
                ),

                const SizedBox(height: 20),

                // Username Field
                TextFormField(
                  controller: _userLoginController,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  // Validate email when the form is submitted
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your email';
                    } else if (!EmailValidator.validate(value)) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Password Field
                TextFormField(
                  controller: _passwordLoginController,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  obscureText: true,
                  inputFormatters: [
                    PasswordTextInputFormatter()
                  ],
                ),

                const SizedBox(height: 20),

                // Login Button
                ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState?.validate() == true) {
                      loginUser();
                    }
                  },
                  child: const Text('Login'),
                ),

                const SizedBox(height: 20),

                // Register Button
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const RegisterPage()),
                    );
                  },
                  child: const Text('Register Here'),
                ),
              ],
            ),
          ),
        ),
      ),
    )
    );
  }
}


class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  RegisterPageState createState() => RegisterPageState();
}

class RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _userControllerF = TextEditingController();
  final TextEditingController _userControllerL = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  // Regular expression for password validation
  final passwordRegex = RegExp(
      r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$');

  final apiURL = "http://www.ckk312.xyz:5000/api/register";

  // Function to register user using API

  void registerUser() async {
    if (!EmailValidator.validate(_emailController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid email')),
      );
      return;
    }

    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Passwords do not match')),
      );
      return;
    }

    if (!passwordRegex.hasMatch(_passwordController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Password must meet complexity requirements')),
      );
      return;
    }

    try {
      final response = await http.post(
        Uri.parse(apiURL),
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonEncode({
          'email': _emailController.text,
          'password': _passwordController.text,
          'firstname': _userControllerF.text,
          'lastname': _userControllerL.text,
        }),
      );

      if (response.statusCode == 200) {
        // Navigate to the next screen if registration is successful
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Server error: ${response.statusCode}'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }

    } catch(e){
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Network error: $e'),
            backgroundColor: Colors.redAccent,
          )
      );
  }
}
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Form(
          key: _formKey,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // First Name Field
                TextFormField(
                  controller: _userControllerF,
                  decoration: const InputDecoration(
                    labelText: 'First Name',
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  inputFormatters: [
                    NameTextInputFormatter()
                  ],
                ),

                const SizedBox(height: 15),

                //Last Name Field
                TextFormField(
                  controller: _userControllerL,
                  decoration: const InputDecoration(
                    labelText: 'Last Name',
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  inputFormatters: [
                    NameTextInputFormatter()
                  ],
                ),

                const SizedBox(height: 15),

                // Email Field
                TextFormField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  validator: (value) {
                    if (value == null || !EmailValidator.validate(value)) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 15),

                // Password Field with regex validation
                TextFormField(
                  controller: _passwordController,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  inputFormatters: [
                    PasswordTextInputFormatter()
                  ],
                  obscureText: true,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a password';
                    } else if (!passwordRegex.hasMatch(value)) {
                      return 'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 15),

                // Confirm Password Field
                TextFormField(
                  controller: _confirmPasswordController,
                  decoration: const InputDecoration(
                    labelText: 'Confirm Password',
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  inputFormatters: [
                    PasswordTextInputFormatter()
                  ],
                  obscureText: true,
                  validator: (value) {
                    if (value != _passwordController.text) {
                      return 'Passwords do not match';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 15),

                // Register Button
                ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      registerUser();
                    }
                  },
                  child: const Text('Register'),
                ),

                const SizedBox(height: 30),

                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const LoginPage())
                    );
                  },
                  child: const Text('Back to Login'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class TitlePage extends StatelessWidget {
  const TitlePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Game Selection'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: GridView.count(
          crossAxisCount: 2, // 2 columns
          crossAxisSpacing: 10.0,
          mainAxisSpacing: 9.0,
          children: [
            // League of Legends
            GestureDetector(
              onTap: () {
                // Navigate or perform action
              },
              child: Column(
                children: [
                  SizedBox(
                    height: 130,
                    width: 130,
                    child: Image.asset(
                      'assets/League-Banner.webp',
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(

                      'League of Legends',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.lightBlueAccent,
                      )
                  ),
                ],
              ),
            ),
            // Rainbow Six
            GestureDetector(
              onTap: () {
                // Navigate or perform action
              },
              child: Column(
                children: [
                  SizedBox(
                    height: 130,
                    width: 130,
                    child: Image.asset(
                      'assets/R6-Logo.webp',
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                      'Rainbow Six',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.lightBlueAccent,
                      )
                  ),
                ],
              ),
            ),
            // Overwatch
            GestureDetector(
              onTap: () {
                // Navigate or perform action
              },
              child: Column(
                children: [
                  SizedBox(
                    height: 130,
                    width: 130,
                    child: Image.asset(
                      'assets/Overwatch-Banner.webp',
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                      'Overwatch',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.lightBlueAccent,
                      )
                  ),
                ],
              ),
            ),
            // Valorant
            GestureDetector(
              onTap: () {
                // Navigate or perform action
              },
              child: Column(
                children: [
                  SizedBox(
                    height: 130,
                    width: 130,
                    child: Image.asset(
                      'assets/Valorant-Banner.webp',
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                      'Valorant',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.lightBlueAccent,
                      )
                  ),
                ],
              ),
            ),
            // Additional slots (add more images and logic as needed)
            GestureDetector(
              onTap: () {
                // Navigate or perform action
              },
              child: Column(
                children: [
                  SizedBox(
                    height: 130,
                    width: 130,
                    child: Image.asset(
                      'assets/Apex-Banner.webp',
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                      'Apex Legends',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.lightBlueAccent,
                      )
                  ),
                ],
              ),
            ),
            GestureDetector(
              onTap: () {
                // Navigate or perform action
              },
              child: Column(
                children: [
                  SizedBox(
                    height: 130,
                    width: 130,
                    child: Image.asset(
                      'assets/COD-Logo.webp',
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                      'COD',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.lightBlueAccent,
                      )
                  ),
                ],
              ),
            ),
            GestureDetector(
              onTap: () {
                // Navigate or perform action
              },
              child: Column(
                children: [
                  SizedBox(
                    height: 130,
                    width: 130,
                    child: Image.asset(
                      'assets/SSBU-Banner.webp',
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                      'Smash Ultimate',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.lightBlueAccent,
                      )
                  ),
                ],
              ),
            ),
            GestureDetector(
              onTap: () {
                // Navigate or perform action
              },
              child: Column(
                children: [
                  SizedBox(
                    height: 130,
                    width: 130,
                    child: Image.asset(
                      'assets/Splatoon3-Banner.webp',
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                      'Splatoon',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        color: Colors.lightBlueAccent,
                      )
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}


class PasswordTextInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final regex = RegExp(r'^[\S]*$');
    return regex.hasMatch(newValue.text) ? newValue : oldValue;
  }
}

class NameTextInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final regex = RegExp(r'^[a-zA-Z]*$');
    return regex.hasMatch(newValue.text) ? newValue : oldValue;
  }
}
