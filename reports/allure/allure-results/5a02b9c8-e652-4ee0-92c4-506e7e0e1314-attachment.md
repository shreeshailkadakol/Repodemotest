# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - img "logo" [ref=e3]
    - generic [ref=e4]: Optimizely
  - list [ref=e8]:
    - listitem [ref=e9]: Log in
    - listitem
    - listitem [ref=e10]:
      - generic [ref=e11]: Name
      - textbox "Name" [active] [ref=e12]
    - listitem [ref=e13]:
      - generic [ref=e14]: Password
      - textbox "Password" [ref=e15]
    - listitem [ref=e16]:
      - button "Log in" [ref=e17] [cursor=pointer]
    - listitem [ref=e18]:
      - paragraph [ref=e19]:
        - link "When you log in, cookies will be used." [ref=e20] [cursor=pointer]:
          - /url: "#"
      - paragraph [ref=e22]: A cookie containing login information will be sent to your web browser. If you do not want to receive cookies, you will be unable to log into the website.
    - listitem
```