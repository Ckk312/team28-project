import 'package:flutter/cupertino.dart';
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
  Widget build(BuildContext context){
    return GestureDetector(
      onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
      child: Scaffold(
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
                      validator: (value){
                        if (value == null || value.isEmpty) {
                          return 'Please enter your password';
                        }
                        return null;
                      },
                      obscureText: true,
                      inputFormatters: [
                        PasswordTextInputFormatter()
                      ],
                    ),

                    const SizedBox(height: 20),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                      // Login Button
                        SizedBox(
                          width: 150,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero
                                )
                            ),
                            onPressed: () {
                              if (_formKey.currentState?.validate() == true) {
                                loginUser();
                              }
                            },
                            child: const Text('Login'),
                          ),
                        ),

                        const SizedBox(width: 60),

                        // Register Button
                        SizedBox(
                          width: 150,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.zero
                              )
                            ),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => const RegisterPage()),
                              );
                            },
                            child: const Text('Register Here'),
                          ),
                        ),
                      ]
                    ),

                    const SizedBox(height: 70),

                    // Forgot Button
                    SizedBox(
                      width: 198,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const ForgotPage()),
                          );
                        },
                        child: const Text('Forgot Your Password?'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        )
      ),
    );
  }
}

class RegisterPage extends StatefulWidget {

  final String ? prefilledEmail;
  const RegisterPage({super.key, this.prefilledEmail});

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
  final passwordRegex = RegExp(r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$');

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
  void initState(){
    super.initState();
    if(widget.prefilledEmail != null)
      {
        _emailController.text = widget.prefilledEmail!;
      }
  }

  @override
  Widget build(BuildContext context){
    return GestureDetector(
      onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
      child: Scaffold(
        appBar: AppBar(
          iconTheme: IconThemeData(
            color: CupertinoColors.white,
          ),
          backgroundColor: Colors.transparent,
        ),
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

                  const SizedBox(height: 8),

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

                  const SizedBox(height: 8),

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
                  const SizedBox(height: 8),

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
                        return '1 Capital letter, 1 number, 1 special character, 8 characters required';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 8),

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
                  const SizedBox(height: 8),

                  // Register Button
                  SizedBox(
                    width: 198,
                    child:
                    ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          registerUser();
                        }
                      },
                      child: const Text('Register'),
                    ),
                  ),

                  const SizedBox(height: 15),

                  SizedBox(
                    width: 198,
                    child:
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const LoginPage())
                        );
                      },
                      child: const Text('Back to Login'),
                    ),
                  ),
                ],  //Children
              ),
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
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout), // Icon for the log out button
            onPressed: () {
              Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginPage())
              );
            },
          ),
        ],
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
                Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => LeaguePlayersList())
                );
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
                Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => RainbowPlayersList())
                );
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
                Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => OverwatchPlayersList())
                );
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
                Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => ValorantPlayersList())
                );
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
                Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => ApexPlayersList())
                );
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
                Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => CODPlayersList())
                );
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
                Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => SmashPlayersList())
                );
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
                Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => SplatoonPlayersList())
                );
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

class ForgotPage extends StatefulWidget {
  const ForgotPage({super.key});

  @override
  ForgotPageState createState() => ForgotPageState();
}

class ForgotPageState extends State<ForgotPage> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _emailController = TextEditingController();

  // Regular expression for password validation
  final passwordRegex = RegExp(
      r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$');

  final apiForgotURL = "http://www.ckk312.xyz:5000/api/forgotpass";

  // Function to register user using API

  void forgotUser() async {
    if (!EmailValidator.validate(_emailController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid email')),
      );
      return;
    }

    try {
      final response = await http.post(
        Uri.parse(apiForgotURL),
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonEncode({
          'email': _emailController.text,
        }),
      );

      if (response.statusCode == 200){
        final responseForgotData = jsonDecode(response.body);
        // Navigate to the next screen if registration is successful
        if(responseForgotData == "Email sent with details to reset your password"){
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                  'Check your email for a link to reset your password.',
                  style: TextStyle(
                    color: CupertinoColors.black
                  ),
              ),
              backgroundColor: Colors.greenAccent,
            ),
          );
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const LoginPage()),
          );
        }
        else{
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                duration: Duration(seconds: 20),
                action: SnackBarAction(
                  textColor: CupertinoColors.white,
                  label: 'Register',
                  onPressed: (){
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => RegisterPage(prefilledEmail: _emailController.text,)),
                    );
                  },
                ),
                content: Text(
                    'Email does not exist. Would you like to register one instead? Click Here',
                    style: TextStyle(
                      color: CupertinoColors.white,
                    ),
                ),
                backgroundColor: Colors.lightBlueAccent,
              ),
          );
        }
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
    return GestureDetector(
      onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
      child: Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData(
          color: CupertinoColors.white,
        ),
        backgroundColor: Colors.transparent,
      ),
      body: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Form(
            key: _formKey,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
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

                  // Register Button
                  SizedBox(
                    width: 198,
                    child:
                    ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          forgotUser();
                        }
                      },
                      child: const Text('Reset Your Password'),
                    ),
                  ),

                  const SizedBox(height: 30),
                  SizedBox(
                    width: 198,
                    child:
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const LoginPage())
                        );
                      },
                      child: const Text('Back to Login'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class ApexPlayersList extends StatefulWidget {
  const ApexPlayersList({super.key});

  @override
  ApexPlayersListState createState() => ApexPlayersListState();
}

class ApexPlayersListState extends State<ApexPlayersList> {
  List<String> mainTeamPlayers = [];
  List<String> academyTeamPlayers = [];

  @override
  void initState() {
    super.initState();
    fetchPlayers();
  }

  Future<void> fetchPlayers() async {
    const String apiUrl = 'http://www.ckk312.xyz:5000/api/searchplayers';
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        body: jsonEncode({
          'query': 'Apex Legends Knights',
          'userId': 1,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        final decodedData = json.decode(response.body);
        final List<dynamic> results = decodedData['result'];

        setState(() {
          // Filter players based on TeamAffiliation explicitly for League of Legends teams
          mainTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights' &&
              player['item']['Game'] == 'Apex Legends') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          academyTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Academy' &&
              player['item']['Game'] == 'Apex Legends') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();
        });
      } else {
        setState(() {
          mainTeamPlayers = [];
          academyTeamPlayers = [];
        });
      }
    } catch (e) {
      setState(() {
        mainTeamPlayers = [];
        academyTeamPlayers = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Apex Legends'),
      ),
      body: mainTeamPlayers.isEmpty && academyTeamPlayers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTeamSection('Knights', mainTeamPlayers), // Top-left
            const SizedBox(height: 75),
            _buildTeamSection('Knights Academy', academyTeamPlayers), // Bottom-left
          ],
        ),
      ),
    );
  }

  // Helper function to build the team section with a title and a list of players.
  Widget _buildTeamSection(String teamName, List<String> players) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTeamTitle(teamName),
        _buildPlayerList(players),
      ],
    );
  }

  // Helper function to build the title for each team section.
  Widget _buildTeamTitle(String teamName) {
    return Text(
      teamName,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: CupertinoColors.systemYellow, // Adjust color if necessary
      ),
    );
  }

  // Helper function to create the list of players in the team.
  Widget _buildPlayerList(List<String> players) {
    return Wrap(
      spacing: 8.0, // Horizontal space between items
      runSpacing: 8.0, // Vertical space between items
      children: players.map((player) {
        return Chip(
          label: Text(
            player,
            style: TextStyle(
              color: CupertinoColors.systemYellow,
              fontSize: 18,// Change player names to yellow
            ),
          ),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          side: BorderSide.none,
          padding: EdgeInsets.zero,
          elevation: 0,
        );
      }).toList(),
    );
  }
}

class LeaguePlayersList extends StatefulWidget {
  const LeaguePlayersList({super.key});

  @override
  LeaguePlayersListState createState() => LeaguePlayersListState();
}

class LeaguePlayersListState extends State<LeaguePlayersList> {
  List<String> mainTeamPlayers = [];
  List<String> academyTeamPlayers = [];

  @override
  void initState() {
    super.initState();
    fetchPlayers();
  }

  Future<void> fetchPlayers() async {
    const String apiUrl = 'http://www.ckk312.xyz:5000/api/searchplayers';
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        body: jsonEncode({
          'query': 'League of Legends Knights', // Ensure the query is correct
          'userId': 1,
        }),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final decodedData = json.decode(response.body);
        final List<dynamic> results = decodedData['result'];

        setState(() {
          // Filter players based on TeamAffiliation explicitly for League of Legends teams
          mainTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights' &&
              player['item']['Game'] == 'League of Legends') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          academyTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Academy' &&
              player['item']['Game'] == 'League of Legends') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();
        });
      } else {
        setState(() {
          mainTeamPlayers = [];
          academyTeamPlayers = [];
        });
      }
    } catch (e) {
      setState(() {
        mainTeamPlayers = [];
        academyTeamPlayers = [];
      });
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('League of Legends'),
      ),
      body: mainTeamPlayers.isEmpty && academyTeamPlayers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTeamSection('Knights', mainTeamPlayers), // Top-left
            const SizedBox(height: 75),
            _buildTeamSection('Knights Academy', academyTeamPlayers), // Bottom-left
          ],
        ),
      ),
    );
  }

  // Helper function to build the team section with a title and a list of players.
  Widget _buildTeamSection(String teamName, List<String> players) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTeamTitle(teamName),
        _buildPlayerList(players),
      ],
    );
  }

  // Helper function to build the title for each team section.
  Widget _buildTeamTitle(String teamName) {
    return Text(
      teamName,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: CupertinoColors.systemYellow, // Adjust color if necessary
      ),
    );
  }

  // Helper function to create the list of players in the team.
  Widget _buildPlayerList(List<String> players) {
    return Wrap(
      spacing: 8.0, // Horizontal space between items
      runSpacing: 8.0, // Vertical space between items
      children: players.map((player) {
        return Chip(
          label: Text(
            player,
            style: TextStyle(
              color: CupertinoColors.systemYellow,
              fontSize: 18,// Change player names to yellow
            ),
          ),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          side: BorderSide.none,
          padding: EdgeInsets.zero,
          elevation: 0,
        );
      }).toList(),
    );
  }
}

class RainbowPlayersList extends StatefulWidget {
  const RainbowPlayersList({super.key});

  @override
  RainbowPlayersListState createState() => RainbowPlayersListState();
}

class RainbowPlayersListState extends State<RainbowPlayersList> {
  List<String> mainTeamPlayers = [];
  List<String> academyTeamPlayers = [];

  @override
  void initState() {
    super.initState();
    fetchPlayers();
  }

  Future<void> fetchPlayers() async {
    const String apiUrl = 'http://www.ckk312.xyz:5000/api/searchplayers';
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        body: jsonEncode({
          'query': 'Rainbow Six Siege Knights',
          'userId': 1,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        final decodedData = json.decode(response.body);
        final List<dynamic> results = decodedData['result'];

        setState(() {
          // Filter players based on TeamAffiliation explicitly for League of Legends teams
          mainTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights' &&
              player['item']['Game'] == 'Rainbow Six Siege') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          academyTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Academy' &&
              player['item']['Game'] == 'Rainbow Six Siege') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();
        });
      } else {
        setState(() {
          mainTeamPlayers = [];
          academyTeamPlayers = [];
        });
      }
    } catch (e) {
      setState(() {
        mainTeamPlayers = [];
        academyTeamPlayers = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rainbow Six'),
      ),
      body: mainTeamPlayers.isEmpty && academyTeamPlayers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTeamSection('Knights', mainTeamPlayers), // Top-left
            const SizedBox(height: 75),
            _buildTeamSection('Knights Academy', academyTeamPlayers), // Bottom-left
          ],
        ),
      ),
    );
  }

  // Helper function to build the team section with a title and a list of players.
  Widget _buildTeamSection(String teamName, List<String> players) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTeamTitle(teamName),
        _buildPlayerList(players),
      ],
    );
  }

  // Helper function to build the title for each team section.
  Widget _buildTeamTitle(String teamName) {
    return Text(
      teamName,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: CupertinoColors.systemYellow, // Adjust color if necessary
      ),
    );
  }

  // Helper function to create the list of players in the team.
  Widget _buildPlayerList(List<String> players) {
    return Wrap(
      spacing: 8.0, // Horizontal space between items
      runSpacing: 8.0, // Vertical space between items
      children: players.map((player) {
        return Chip(
          label: Text(
            player,
            style: TextStyle(
              color: CupertinoColors.systemYellow,
              fontSize: 18,// Change player names to yellow
            ),
          ),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          side: BorderSide.none,
          padding: EdgeInsets.zero,
          elevation: 0,
        );
      }).toList(),
    );
  }
}

class OverwatchPlayersList extends StatefulWidget {
  const OverwatchPlayersList({super.key});

  @override
  OverwatchPlayersListState createState() => OverwatchPlayersListState();
}

class OverwatchPlayersListState extends State<OverwatchPlayersList> {
  List<String> mainTeamPlayers = [];
  List<String> academyTeamPlayers = [];

  @override
  void initState() {
    super.initState();
    fetchPlayers();
  }

  Future<void> fetchPlayers() async {
    const String apiUrl = 'http://www.ckk312.xyz:5000/api/searchplayers';
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        body: jsonEncode({
          'query': 'Overwatch Knights',
          'userId': 1,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        final decodedData = json.decode(response.body);
        final List<dynamic> results = decodedData['result'];

        setState(() {
          // Filter players based on TeamAffiliation explicitly for League of Legends teams
          mainTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights' &&
              player['item']['Game'] == 'Overwatch 2') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          academyTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Academy' &&
              player['item']['Game'] == 'Overwatch 2') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();
        });
      } else {
        setState(() {
          mainTeamPlayers = [];
          academyTeamPlayers = [];
        });
      }
    } catch (e) {
      setState(() {
        mainTeamPlayers = [];
        academyTeamPlayers = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Overwatch 2'),
      ),
      body: mainTeamPlayers.isEmpty && academyTeamPlayers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTeamSection('Knights', mainTeamPlayers), // Top-left
            const SizedBox(height: 75),
            _buildTeamSection('Knights Academy', academyTeamPlayers), // Bottom-left
          ],
        ),
      ),
    );
  }

  // Helper function to build the team section with a title and a list of players.
  Widget _buildTeamSection(String teamName, List<String> players) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTeamTitle(teamName),
        _buildPlayerList(players),
      ],
    );
  }

  // Helper function to build the title for each team section.
  Widget _buildTeamTitle(String teamName) {
    return Text(
      teamName,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: CupertinoColors.systemYellow, // Adjust color if necessary
      ),
    );
  }

  // Helper function to create the list of players in the team.
  Widget _buildPlayerList(List<String> players) {
    return Wrap(
      spacing: 8.0, // Horizontal space between items
      runSpacing: 8.0, // Vertical space between items
      children: players.map((player) {
        return Chip(
          label: Text(
            player,
            style: TextStyle(
              fontSize: 18,
              color: CupertinoColors.systemYellow, // Change player names to yellow
            ),
          ),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          side: BorderSide.none,
          padding: EdgeInsets.zero,
          elevation: 0,
        );
      }).toList(),
    );
  }
}

class ValorantPlayersList extends StatefulWidget {
  const ValorantPlayersList({super.key});

  @override
  ValorantPlayersListState createState() => ValorantPlayersListState();
}

class ValorantPlayersListState extends State<ValorantPlayersList> {
  List<String> mainTeamPlayers = [];
  List<String> academyTeamPlayers = [];
  List<String> risingTeamPlayers = [];
  List<String> pinkTeamPlayers = [];

  @override
  void initState() {
    super.initState();
    fetchPlayers();
  }

  Future<void> fetchPlayers() async {
    const String apiUrl = 'http://www.ckk312.xyz:5000/api/searchplayers';
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        body: jsonEncode({
          'query': 'Valorant Knights',
          'userId': 1,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        final decodedData = json.decode(response.body);
        final List<dynamic> results = decodedData['result'];

        setState(() {
          // Filter players based on TeamAffiliation explicitly for League of Legends teams
          mainTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights' &&
              player['item']['Game'] == 'Valorant') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          academyTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Academy' &&
              player['item']['Game'] == 'Valorant') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          risingTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Rising' &&
              player['item']['Game'] == 'Valorant') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          pinkTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Pink' &&
              player['item']['Game'] == 'Valorant') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();
        });
      } else {
        setState(() {
          mainTeamPlayers = [];
          academyTeamPlayers = [];
          risingTeamPlayers = [];
          pinkTeamPlayers = [];
        });
      }
    } catch (e) {
      setState(() {
        mainTeamPlayers = [];
        academyTeamPlayers = [];
        risingTeamPlayers = [];
        pinkTeamPlayers = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Valorant'),
      ),
      body: mainTeamPlayers.isEmpty && academyTeamPlayers.isEmpty && risingTeamPlayers.isEmpty && pinkTeamPlayers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if(mainTeamPlayers.isNotEmpty)
              _buildTeamSection('Knights', mainTeamPlayers), // Top-left
            const SizedBox(height: 75),
            if(academyTeamPlayers.isNotEmpty)
              _buildTeamSection('Knights Academy', academyTeamPlayers),
            const SizedBox(height: 75),
            if(risingTeamPlayers.isNotEmpty)
              _buildTeamSection('Knights Rising', risingTeamPlayers),
            const SizedBox(height: 75),
            if(pinkTeamPlayers.isNotEmpty)
              _buildTeamSection('Knights Pink', pinkTeamPlayers),// Bottom-left
          ],
        ),
      ),
    );
  }

  // Helper function to build the team section with a title and a list of players.
  Widget _buildTeamSection(String teamName, List<String> players) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTeamTitle(teamName),
        _buildPlayerList(players),
      ],
    );
  }

  // Helper function to build the title for each team section.
  Widget _buildTeamTitle(String teamName) {
    return Text(
      teamName,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: CupertinoColors.systemYellow, // Adjust color if necessary
      ),
    );
  }

  // Helper function to create the list of players in the team.
  Widget _buildPlayerList(List<String> players) {
    return Wrap(
      spacing: 8.0, // Horizontal space between items
      runSpacing: 8.0, // Vertical space between items
      children: players.map((player) {
        return Chip(
          label: Text(
            player,
            style: TextStyle(
              color: CupertinoColors.systemYellow,
              fontSize: 18,// Change player names to yellow
            ),
          ),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          side: BorderSide.none,
          padding: EdgeInsets.zero,
          elevation: 0,
        );
      }).toList(),
    );
  }
}

class CODPlayersList extends StatefulWidget {
  const CODPlayersList({super.key});

  @override
  CODPlayersListState createState() => CODPlayersListState();
}

class CODPlayersListState extends State<CODPlayersList> {
  List<String> mainTeamPlayers = [];
  List<String> academyTeamPlayers = [];

  @override
  void initState() {
    super.initState();
    fetchPlayers();
  }

  Future<void> fetchPlayers() async {
    const String apiUrl = 'http://www.ckk312.xyz:5000/api/searchplayers';
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        body: jsonEncode({
          'query': 'Call Knights',
          'userId': 1,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        final decodedData = json.decode(response.body);
        final List<dynamic> results = decodedData['result'];

        setState(() {
          // Filter players based on TeamAffiliation explicitly for League of Legends teams
          mainTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights' &&
              player['item']['Game'] == 'Call of Duty') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          academyTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Academy' &&
              player['item']['Game'] == 'Call of Duty') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();
        });
      } else {
        setState(() {
          mainTeamPlayers = [];
          academyTeamPlayers = [];
        });
      }
    } catch (e) {
      setState(() {
        mainTeamPlayers = [];
        academyTeamPlayers = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Call of Duty'),
      ),
      body: mainTeamPlayers.isEmpty && academyTeamPlayers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTeamSection('Knights', mainTeamPlayers), // Top-left
            const SizedBox(height: 75),
            _buildTeamSection('Knights Academy', academyTeamPlayers), // Bottom-left
          ],
        ),
      ),
    );
  }

  // Helper function to build the team section with a title and a list of players.
  Widget _buildTeamSection(String teamName, List<String> players) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTeamTitle(teamName),
        _buildPlayerList(players),
      ],
    );
  }

  // Helper function to build the title for each team section.
  Widget _buildTeamTitle(String teamName) {
    return Text(
      teamName,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: CupertinoColors.systemYellow, // Adjust color if necessary
      ),
    );
  }

  // Helper function to create the list of players in the team.
  Widget _buildPlayerList(List<String> players) {
    return Wrap(
      spacing: 8.0, // Horizontal space between items
      runSpacing: 8.0, // Vertical space between items
      children: players.map((player) {
        return Chip(
          label: Text(
            player,
            style: TextStyle(
              color: CupertinoColors.systemYellow,
              fontSize: 18,// Change player names to yellow
            ),
          ),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          side: BorderSide.none,
          padding: EdgeInsets.zero,
          elevation: 0,
        );
      }).toList(),
    );
  }
}

class SmashPlayersList extends StatefulWidget {
  const SmashPlayersList({super.key});

  @override
  SmashPlayersListState createState() => SmashPlayersListState();
}

class SmashPlayersListState extends State<SmashPlayersList> {
  List<String> mainTeamPlayers = [];
  List<String> academyTeamPlayers = [];

  @override
  void initState() {
    super.initState();
    fetchPlayers();
  }

  Future<void> fetchPlayers() async {
    const String apiUrl = 'http://www.ckk312.xyz:5000/api/searchplayers';
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        body: jsonEncode({
          'query': 'Smash Bros Ultimate Knights',
          'userId': 1,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        final decodedData = json.decode(response.body);
        final List<dynamic> results = decodedData['result'];

        setState(() {
          // Filter players based on TeamAffiliation explicitly for League of Legends teams
          mainTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights' &&
              player['item']['Game'] == 'Smash Bros Ultimate') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          academyTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Academy' &&
              player['item']['Game'] == 'Smash Bros Ultimate') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();
        });
      } else {
        setState(() {
          mainTeamPlayers = [];
          academyTeamPlayers = [];
        });
      }
    } catch (e) {
      setState(() {
        mainTeamPlayers = [];
        academyTeamPlayers = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Smash Ultimate'),
      ),
      body: mainTeamPlayers.isEmpty && academyTeamPlayers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if(mainTeamPlayers.isNotEmpty)
              _buildTeamSection('Knights', mainTeamPlayers), // Top-left
            const SizedBox(height: 75),
            if(academyTeamPlayers.isNotEmpty)
              _buildTeamSection('Knights Academy', academyTeamPlayers), // Bottom-left
          ],
        ),
      ),
    );
  }

  // Helper function to build the team section with a title and a list of players.
  Widget _buildTeamSection(String teamName, List<String> players) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTeamTitle(teamName),
        _buildPlayerList(players),
      ],
    );
  }

  // Helper function to build the title for each team section.
  Widget _buildTeamTitle(String teamName) {
    return Text(
      teamName,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: CupertinoColors.systemYellow, // Adjust color if necessary
      ),
    );
  }

  // Helper function to create the list of players in the team.
  Widget _buildPlayerList(List<String> players) {
    return Wrap(
      spacing: 8.0, // Horizontal space between items
      runSpacing: 8.0, // Vertical space between items
      children: players.map((player) {
        return Chip(
          label: Text(
            player,
            style: TextStyle(
              color: CupertinoColors.systemYellow,
              fontSize: 18,// Change player names to yellow
            ),
          ),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          side: BorderSide.none,
          padding: EdgeInsets.zero,
          elevation: 0,
        );
      }).toList(),
    );
  }
}

class SplatoonPlayersList extends StatefulWidget {
  const SplatoonPlayersList({super.key});

  @override
  SplatoonPlayersListState createState() => SplatoonPlayersListState();
}

class SplatoonPlayersListState extends State<SplatoonPlayersList> {
  List<String> mainTeamPlayers = [];
  List<String> academyTeamPlayers = [];
  List<String> risingTeamPlayers = [];

  @override
  void initState() {
    super.initState();
    fetchPlayers();
  }

  Future<void> fetchPlayers() async {
    const String apiUrl = 'http://www.ckk312.xyz:5000/api/searchplayers';
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        body: jsonEncode({
          'query': 'Splatoon Knights',
          'userId': 1,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      );

      if (response.statusCode == 200) {
        final decodedData = json.decode(response.body);
        final List<dynamic> results = decodedData['result'];

        setState(() {
          // Filter players based on TeamAffiliation explicitly for League of Legends teams
          mainTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights' &&
              player['item']['Game'] == 'Splatoon') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          academyTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Academy' &&
              player['item']['Game'] == 'Splatoon') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();

          risingTeamPlayers = results
              .where((player) =>
          player['item']['TeamAffiliation'] == 'Knights Rising' &&
              player['item']['Game'] == 'Splatoon') // Add filtering for the correct game
              .map<String>((player) => player['item']['Username'])
              .toList();
        });
      } else {
        setState(() {
          mainTeamPlayers = [];
          academyTeamPlayers = [];
          risingTeamPlayers = [];
        });
      }
    } catch (e) {
      setState(() {
        mainTeamPlayers = [];
        academyTeamPlayers = [];
        risingTeamPlayers = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Splatoon'),
      ),
      body: mainTeamPlayers.isEmpty && academyTeamPlayers.isEmpty && risingTeamPlayers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if(mainTeamPlayers.isNotEmpty)
              _buildTeamSection('Knights', mainTeamPlayers), // Top-left
            const SizedBox(height: 75),
            if(academyTeamPlayers.isNotEmpty)
              _buildTeamSection('Knights Academy', academyTeamPlayers),
            const SizedBox(height: 75),
            if(risingTeamPlayers.isNotEmpty)
              _buildTeamSection('Knights Rising', risingTeamPlayers),// Bottom-left
          ],
        ),
      ),
    );
  }

  // Helper function to build the team section with a title and a list of players.
  Widget _buildTeamSection(String teamName, List<String> players) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTeamTitle(teamName),
        _buildPlayerList(players),
      ],
    );
  }

  // Helper function to build the title for each team section.
  Widget _buildTeamTitle(String teamName) {
    return Text(
      teamName,
      style: const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: CupertinoColors.systemYellow, // Adjust color if necessary
      ),
    );
  }

  // Helper function to create the list of players in the team.
  Widget _buildPlayerList(List<String> players) {
    return Wrap(
      spacing: 8.0, // Horizontal space between items
      runSpacing: 8.0, // Vertical space between items
      children: players.map((player) {
        return Chip(
          label: Text(
            player,
            style: TextStyle(
              color: CupertinoColors.systemYellow,
              fontSize: 18,// Change player names to yellow
            ),
          ),
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          side: BorderSide.none,
          padding: EdgeInsets.zero,
          elevation: 0,
        );
      }).toList(),
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
